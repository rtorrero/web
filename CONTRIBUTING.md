# How to contribute

Thanks for showing interest and sharing your time to contribute to this project!

This guide is meant to be used as an overview on how to participate in issues by
creating them in the 



## Opening issues

Before creating a new issue make sure you use the search functionality to confirm
that a similar issue doesn't already exist. Next, make sure you properly label
the issue as per our [labels](https://github.com/trento-project/web/labels)

If you are reporting a `bug`, please share a file generated using the 
`trento-support.sh` script with the following params:
```
# trento-support.sh --collect all --output file-tgz
```
and include the output to your issue. The script should remove sensitive data
automatically but please make sure you are not sharing anything sensible yourself.

## Submitting changes


### Pull Requests guideline

Reviews are hard. This few points will help reduce the effort and allow us to
merge your changes faster.

1. Only touch relevant files
2. Check that the tests are passing
3. Commit history should be short

Please send a [GitHub Pull Request to Trento](https://github.com/trento-project/web/pull/new/main) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

```
git commit -m "A brief summary of the commit
     
A paragraph describing what changed and its impact."
```