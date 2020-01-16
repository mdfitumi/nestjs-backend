import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { InjectRedis } from '@mobizerg/nest-ioredis';
import { Redis } from 'ioredis';
import * as msgpack from 'msgpack5';

const NCHAN_PUBLISH_COMMAND = 'nchan_publish';
const NUM_KEYS = 11;
const NAMESPACE = 'ic';
const EVENTSOURCE_EVENT = '';
const COMPRESSION_SETTING = '';
const TTL = 300;
const MSG_BUF_MAX_SIZE = 512;
const PUBSUB_MSGPACKED_SIZE_CUTOFF = 0;
const OPTIMIZE_TARGET = 0;

@Injectable()
export class QuestPublisherService {
  private readonly msgpack = msgpack();
  constructor(
    @InjectRedis()
    private redis: Redis,
  ) {}
  publishCampaignQuest(campaignId: number, quest: string) {
    const channelId = `{channel:/${campaignId}}:pubsub`;
    // return this.redis.send_command(
    //   NCHAN_PUBLISH_COMMAND,
    //   'ic',
    //   campaignId,
    //   '',
    //   quest,
    // );
    // return this.redis.eval(
    //   NCHAN_REDIS_PUBLISH_SCRIPT,
    //   NUM_KEYS,
    //   NAMESPACE,
    //   campaignId,
    //   String(new Date().getTime()).slice(0, 10),
    //   quest,
    //   'application/json',
    //   EVENTSOURCE_EVENT,
    //   COMPRESSION_SETTING,
    //   TTL,
    //   MSG_BUF_MAX_SIZE,
    //   PUBSUB_MSGPACKED_SIZE_CUTOFF,
    //   OPTIMIZE_TARGET,
    // );
    const now = String(new Date().getTime()).slice(0, 10);
    // const msg = {
    //   content_type: 'application/json',
    //   data: 'quest',
    //   time: now,
    //   eventsource_event: '',
    //   ttl: 300,
    //   prev_time: 0,
    //   prev_tag: 0,
    //   tag: 0,
    // };
    // const msg = {
    //   message: 'quest',
    //   time: now,
    //   tag: 0,
    // };
    const msg = [
      'ch+msg',
      channelId,
      300,
      Number(now),
      0,
      0,
      0,
      quest,
      'application/json',
    ];
    const encoded = this.msgpack.encode(msg);
    return this.redis.publishBuffer(channelId, encoded.slice());
  }

  publishCampaignQuest2(campaignId: number, quest: string) {
    return axios.post(`http://nginx:8003/pub?campaignId=${campaignId}`, quest);
  }

  publishCampaignQuest3(campaignId: number, quest: string) {
    const now = String(new Date().getTime()).slice(0, 10);
    const msg = {
      content_type: 'application/json',
      data: quest,
      prev_tag: 0,
      time: now,
      eventsource_event: '',
      prev_time: 0,
      ttl: 300,
      tag: 0,
    };
    // await this.redis.lpush(`{channel:/campaign:${campaignId}}:messages`, msg);
    // Object.entries({
    //   current_message: msg,
    //   time: now,
    //   max_stored_messages: 100,
    // }).forEach(
    //   async ([key, value]) =>
    //     await this.redis.hset(
    //       `{channel:/campaign:${campaignId}}`,
    //       String(key),
    //       String(value),
    //     ),
    // );
  }
}

const NCHAN_REDIS_PUBLISH_SCRIPT = `
local ns, id=ARGV[1], ARGV[2]

local msg = {}

local store_at_most_n_messages = tonumber(ARGV[9])
if store_at_most_n_messages == nil or store_at_most_n_messages == "" then
  return {err="Argument 9, max_msg_buf_size, can't be empty"}
end
if store_at_most_n_messages == 0 then
  msg.unbuffered = 1
end

local msgpacked_pubsub_cutoff = tonumber(ARGV[10])

local optimize_target = tonumber(ARGV[11]) == 2 and "bandwidth" or "cpu"

local time
if optimize_target == "cpu" and redis.replicate_commands then
  -- we're on redis >= 3.2. We can use We can use 'script effects replication' to allow
  -- writing nondeterministic command values like TIME.
  -- That's exactly what we want to do, use Redis' TIME rather than the given time from Nginx
  -- Also, it's more efficient to replicate just the commands in this case rather than run the whole script
  redis.replicate_commands()
  time = tonumber(redis.call('TIME')[1])
else
  --fallback to the provided time
  time = tonumber(ARGV[3])
end

msg.id=nil
msg.data= ARGV[4]
msg.content_type=ARGV[5]
msg.eventsource_event=ARGV[6]
msg.compression=tonumber(ARGV[7])
msg.ttl= tonumber(ARGV[8])
msg.time= time
msg.tag= 0

if msg.ttl == 0 then
  msg.ttl = 126144000 --4 years
end

--[[local dbg = function(...)
  local arg = {...}
  for i = 1, #arg do
    arg[i]=tostring(arg[i])
  end
  redis.call('echo', table.concat(arg, ", "))
end]]

if type(msg.content_type)=='string' and msg.content_type:find(':') then
  return {err='Message content-type cannot contain ":" character.'}
end

redis.call('echo', ' #######  PUBLISH   ######## ')

-- sets all fields for a hash from a dictionary
local hmset = function (key, dict)
  if next(dict) == nil then return nil end
  local bulk = {}
  for k, v in pairs(dict) do
    table.insert(bulk, k)
    table.insert(bulk, v)
  end
  return redis.call('HMSET', key, unpack(bulk))
end

local tohash=function(arr)
  if type(arr)~="table" then
    return nil
  end
  local h = {}
  local k=nil
  for i, v in ipairs(arr) do
    if k == nil then
      k=v
    else
      h[k]=v; k=nil
    end
  end
  return h
end

local ch = ('%s{channel:%s}'):format(ns, id)
local msg_fmt = ch..':msg:%s'
local key={
  last_message= msg_fmt, --not finished yet
  message=      msg_fmt, --not finished yet
  channel=      ch,
  messages=     ch..':messages',
  subscribers=  ch..':subscribers'
}
local channel_pubsub = ch..':pubsub'

local new_channel
local channel
if redis.call('EXISTS', key.channel) ~= 0 then
  channel=tohash(redis.call('HGETALL', key.channel))
  channel.max_stored_messages = tonumber(channel.max_stored_messages)
end

if channel~=nil then
  --dbg("channel present")
  if channel.current_message ~= nil then
    --dbg("channel current_message present")
    key.last_message=key.last_message:format(channel.current_message, id)
  else
    --dbg("channel current_message absent")
    key.last_message=nil
  end
  new_channel=false
else
  --dbg("channel missing")
  channel={}
  new_channel=true
  key.last_message=nil
end

--set new message id
local lastmsg, lasttime, lasttag
if key.last_message then
  lastmsg = redis.call('HMGET', key.last_message, 'time', 'tag')
  lasttime, lasttag = tonumber(lastmsg[1]), tonumber(lastmsg[2])
  --dbg("New message id: last_time ", lasttime, " last_tag ", lasttag, " msg_time ", msg.time)
  if lasttime and tonumber(lasttime) > tonumber(msg.time) then
    redis.log(redis.LOG_WARNING, "Nchan: message for " .. id .. " arrived a little late and may be delivered out of order. Redis must be very busy, or the Nginx servers do not have their times synchronized.")
    msg.time = lasttime
    time = lasttime
  end
  if lasttime and lasttime==msg.time then
    msg.tag=lasttag+1
  end
  msg.prev_time = lasttime
  msg.prev_tag = lasttag
else
  msg.prev_time = 0
  msg.prev_tag = 0
end
msg.id=('%i:%i'):format(msg.time, msg.tag)

key.message=key.message:format(msg.id)
if redis.call('EXISTS', key.message) ~= 0 then
  local hash_tostr=function(h)
    local tt = {}
    for k, v in pairs(h) do
      table.insert(tt, ("%s: %s"):format(k, v))
    end
    return "{" .. table.concat(tt,", ") .. "}"
  end
  local existing_msg = tohash(redis.call('HGETALL', key.message))
  local errmsg = "Message %s for channel %s id %s already exists. time: %s lasttime: %s lasttag: %s. dbg: channel: %s, messages_key: %s, msglist: %s, msg: %s, msg_expire: %s."
  errmsg = errmsg:format(key.message, id, msg.id or "-", time or "-", lasttime or "-", lasttag or "-", hash_tostr(channel), key.messages, "["..table.concat(redis.call('LRANGE', key.messages, 0, -1), ", ").."]", hash_tostr(existing_msg), redis.call('TTL', key.message))
  return {err=errmsg}
end

msg.prev=channel.current_message
if key.last_message and redis.call('exists', key.last_message) == 1 then
  redis.call('HSET', key.last_message, 'next', msg.id)
end

--update channel
redis.call('HSET', key.channel, 'current_message', msg.id)
if msg.prev then
  redis.call('HSET', key.channel, 'prev_message', msg.prev)
end
if time then
  redis.call('HSET', key.channel, 'time', time)
end

local message_len_changed = false
if channel.max_stored_messages ~= store_at_most_n_messages then
  channel.max_stored_messages = store_at_most_n_messages
  message_len_changed = true
  redis.call('HSET', key.channel, 'max_stored_messages', store_at_most_n_messages)
  --dbg("channel.max_stored_messages was not set, but is now ", store_at_most_n_messages)
end

--write message
hmset(key.message, msg)


--check old entries
local oldestmsg=function(list_key, old_fmt)
  local old, oldkey
  local n, del=0,0
  while true do
    n=n+1
    old=redis.call('lindex', list_key, -1)
    if old then
      oldkey=old_fmt:format(old)
      local ex=redis.call('exists', oldkey)
      if ex==1 then
        return oldkey
      else
        redis.call('rpop', list_key)
        del=del+1
      end
    else
      break
    end
  end
end

local max_stored_msgs = channel.max_stored_messages or -1

if max_stored_msgs < 0 then --no limit
  oldestmsg(key.messages, msg_fmt)
  redis.call('LPUSH', key.messages, msg.id)
elseif max_stored_msgs > 0 then
  local stored_messages = tonumber(redis.call('LLEN', key.messages))
  redis.call('LPUSH', key.messages, msg.id)
  -- Reduce the message length if necessary
  local dump_message_ids = redis.call('LRANGE', key.messages, max_stored_msgs, stored_messages);
  if dump_message_ids then
    for _, msgid in ipairs(dump_message_ids) do
      redis.call('DEL', msg_fmt:format(msgid))
    end
  end
  redis.call('LTRIM', key.messages, 0, max_stored_msgs - 1)
  oldestmsg(key.messages, msg_fmt)
end


--set expiration times for all the things
local channel_ttl = tonumber(redis.call('TTL',  key.channel))
redis.call('EXPIRE', key.message, msg.ttl)
if msg.ttl + 1 > channel_ttl then -- a little extra time for failover weirdness for 1-second TTL messages
  redis.call('EXPIRE', key.channel, msg.ttl + 1)
  redis.call('EXPIRE', key.messages, msg.ttl + 1)
  redis.call('EXPIRE', key.subscribers, msg.ttl + 1)
end

--publish message
local unpacked

if msg.unbuffered or #msg.data < msgpacked_pubsub_cutoff then
  unpacked= {
    "msg",
    msg.ttl or 0,
    msg.time,
    tonumber(msg.tag) or 0,
    (msg.unbuffered and 0 or msg.prev_time) or 0,
    (msg.unbuffered and 0 or msg.prev_tag) or 0,
    msg.data or "",
    msg.content_type or "",
    msg.eventsource_event or "",
    msg.compression or 0
  }
else
  unpacked= {
    "msgkey",
    msg.time,
    tonumber(msg.tag) or 0,
    key.message
  }
end

if message_len_changed then
  unpacked[1] = "max_msgs+" .. unpacked[1]
  table.insert(unpacked, 2, tonumber(channel.max_stored_messages))
end

local msgpacked

--dbg(("Stored message with id %i:%i => %s"):format(msg.time, msg.tag, msg.data))

--we used to publish conditionally on subscribers on the Redis pubsub channel
--but now that we're subscribing to slaves this is not possible
--so just PUBLISH always.
msgpacked = cmsgpack.pack(unpacked)
redis.call('PUBLISH', channel_pubsub, msgpacked)

local num_messages = redis.call('llen', key.messages)

--dbg("channel ", id, " ttl: ",channel.ttl, ", subscribers: ", channel.subscribers, "(fake: ", channel.fake_subscribers or "nil", "), messages: ", num_messages)
local ch = {
  tonumber(channel.ttl or msg.ttl),
  tonumber(channel.last_seen_fake_subscriber) or 0,
  tonumber(channel.fake_subscribers or channel.subscribers) or 0,
  msg.time and msg.time and ("%i:%i"):format(msg.time, msg.tag) or "",
  tonumber(num_messages)
}

return {ch, new_channel}`;
