# cachon

Cachon is a set of convenience functions that you can add to a [node_redis](https://github.com/mranney/node_redis) connection. It introduces a pattern for caching that makes it simple to take an existing function that returns a result and add a caching layer to the flow.

## install

You will need to install node_redis as well as cachon to get started. With npm, something like:

> npm install hiredis redis cachon

## use

