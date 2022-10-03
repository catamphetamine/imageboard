# Thoughts

These are some thoughts on possible enhancements, etc.

## Deleting Comments

Most "legacy" imageboard engines simply erase comments when deleting them. This introduces non-trivial engineering issues:

* When attempting to update a thread in real time (i.e. incrementally), the code has to compare "old" and "new" sets of comments, find out which ones got removed, restore the removed ones, and then append the last of the "new" comments to the "old" ones. If removed comments were still retained in the form of placeholders, the "finding the difference" algorithm would become significantly simpler.

* Same goes for refreshing a tracked thread — same needless complexity. Suppose a tracked thread is refreshed and it find out that there're 3 new comments. It shows a "3" indication in the sidebar. Next, after some time, it attempts to refresh the tracked thread once again, only to find out that those 3 new comments got deleted. How can it find out how many new comments are there now? It'll have to rewind back the history of previously refreshed comments, matching that history against the actual set of existing comments in the thread, find the latest comment shared between both of them, and then re-compute the counters. Have those 3 deleted comments been preserved in the form of placeholders, the algorithm would've been significantly simpler.

So, instead of simply erasing them, comments that're being deleted should be replaced with some "dummy" "deleted comment" object, with the `id` and `createdAt` date copied over from the original comment, possibly along with some other properties like:

* The IDs of the comments it replied to.
* The IP address hash of the comment author.
* Perhaps some other non-"private" info (assuming the comment was deleted for privacy reasons).

## Persistent Sequential Comment Indexes

This issue is tied directly to the "Deleting Comments" one:

Imageboard engines should also come up with the idea of "autoincrement" per-thread IDs. The currently adopted comment IDs are board-wide while instead they should've been thread-wide. They should also be sequential: the original comment gets a `sequential_id` of `1`, and so on. When a comment gets "deleted", it's not actually "deleted", so the `sequential_id` remains intact. The current "max sequential id" could be stored somewhere in the thread data (`max_sequential_id`). If a thread is a "trimming" ("endless", "recurring", "snake bites its tail") one, then such sequential IDs would still work.

How could "sequential IDs" be used, apart from them being just a good engineering practice? For example, they could be used to quickly check if there're new comments in a thread. For that, one would first get the latest sequential ID of a thread, and then compare it to the sequential ID of the "latest read" comment in that thread. The difference would yield the count of new comments. This approach wouldn't tell if there're any new "replies", but for just comments that would work.
