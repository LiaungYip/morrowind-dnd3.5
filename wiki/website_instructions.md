# Instructions for setting up Markdoc on NearlyFreeSpeech.Net

This guide gives instructions on how to set up a Markdoc wiki on a NearlyFreeSpeech web hosting account. (This is the method used to host this page.)

The content for the wiki will be kept in a Git repository. Pushing the repository to the webserver will cause the website to be freshly rebuilt.

The instructions assume you are working on a Windows computer; it should be even easier than this if you are using OSX or Linux.

## Server side setup

Log into your NearlyFreeSpeech website via SSH and perform the following steps:

1. Install Markdoc: `easy_install --user markdoc`
2. Add this line to the top of your `~/.bashrc`: `export PATH=$PATH:$HOME/.local/bin
`. (This will put `markdoc` on your `PATH`.)
3. Initialise a new, bare, git repository: `git init /home/private/git/mywiki --bare`. Note your choice of directory for later.
4. Create a shell script called `/home/private/git/mywiki/hooks/post-receive` and paste in the shell script below.
5. Make the script executable: `chmod +x /home/private/git/mywiki/hooks/post-receive`


### Content of `post-receive` shell script


```bash
#!/bin/sh

# Partially plagiarised from http://majorursa.net/content/using-jekyll-nearlyfreespeechnet

# Put Python local packages on the PATH
export PATH=$PATH:$HOME.local/bin/

REPONAME=mywiki
GIT_REPO=$HOME/git/$REPONAME
TMP_GIT_CLONE=$HOME/git/tmp_deploy/$REPONAME
PUBLIC_WWW=/home/public/mywiki/

echo "==== Making temporary git clone===="
git clone $GIT_REPO $TMP_GIT_CLONE
cd $TMP_GIT_CLONE

echo "==== Building site ===="
markdoc --verbose build

echo "==== Beginning rsync ===="
rsync -vax --cvs-exclude --delete --ignore-errors --include=.htaccess --exclude=.* --exclude=_* .html/ $PUBLIC_WWW/

echo "==== Cleaning up temporary files ===="
rm -Rf $HOME/git/tmp_deploy/$REPONAME/.git/objects
rm -Rf $HOME/git/tmp_deploy/$REPONAME/.git
rm -Rf $HOME/git/tmp_deploy/$REPONAME

exit

```



Note: if you get an error like...

`bash: ./post-receive: /bin/sh^M: bad interpreter: No such file or directory`

... when running this (or any) BASH script - it means that your shell script has Windows line endings. Try `dos2unix post-receive` to fix that. Refer [StackOverflow](http://stackoverflow.com/questions/2920416/configure-bin-shm-bad-interpreter).


## Windows desktop setup

You will work on the website content on your Windows desktop, pushing the changes to the NearlyFreeSpeech.Net server when you are ready to publish the website.

Where `terminal commands` are shown, execute these in a `cmd.exe` or Powershell window.

1. Install Python 2, `pip`, and git. If you use Chocolatey (the Windows equivalent of apt-get) then this is a simple matter of running `cinst python2 pip git` as Administrator. Otherwise, go to the appropriate websites, download the software installers and run them.
3. Install Markdoc: `pip install markdoc` (as Administrator)
4. Initialise new wiki: `markdoc.exe init --vcs-ignore git C:\mywiki\`
5. Goto new wiki: `cd C:\mywiki`
6. Initialise new git repository: `git init .`
7. Add git remote: `git remote add nfsn ssh://<username>_<site>@ssh.<servername>.nearlyfreespeech.net:/home/private/git/mywiki/`. Note the trailing slash.
	* `nfsn` is a short nickname you will use when pushing to the web host, i.e. `git push nfsn`.
	* `username` is your NearlyFreeSpeech.net username.
	* `sitename` is your NearlyFreeSpeech.net site name.
	* `/home/private/git/mywiki` is the path to your wiki from Step 2 of the server-side setup, above.
8. Create some content, say in `test.md`
9. Push website up to web host - `git push nfsn`

Tips:

* If you set up public-key authentication, you won't have to type your NearlyFreeSpeech.Net password every time you do a `git push nfsn`.

## Example  output after `git push nfsn`

```
C:\Users\lws\Documents\GitHub\morrowind-dnd3.5>git push nfsn
Counting objects: 5, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 1.11 KiB | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: ==== Making temporary git clone====
remote: Cloning into '/home/private//git/tmp_deploy/morrowind-dnd3.5'...
remote: done.
remote: ==== Building site ====
remote: markdoc: DEBUG: Running markdoc.build
remote: markdoc: DEBUG: Running markdoc.clean-temp
remote: markdoc.clean-temp: DEBUG: makedirs /home/private/git/tmp_deploy/morrowi
nd-dnd3.5/.tmp
remote: markdoc: DEBUG: Running markdoc.sync-html
remote: markdoc.sync-html: DEBUG: makedirs /home/private/git/tmp_deploy/morrowin
d-dnd3.5/.html
remote: markdoc.sync-html: DEBUG: rsync -vaxq --cvs-exclude --delete --ignore-er
rors --include=.htaccess --exclude=.* --exclude=_* .tmp/ default-static/ .html/
remote: markdoc.sync-html: DEBUG: rsync completed
remote: markdoc: DEBUG: Running markdoc.build-listing
remote: markdoc.build-listing: DEBUG: Generating listing for /
remote: markdoc.build-listing: DEBUG: cp //_list.html //index.html
remote: markdoc.build-listing: DEBUG: Generating listing for /media
remote: markdoc.build-listing: DEBUG: cp /media/_list.html /media/index.html
remote: markdoc.build-listing: DEBUG: Generating listing for /media/sass
remote: markdoc.build-listing: DEBUG: cp /media/sass/_list.html /media/sass/inde
x.html
remote: markdoc.build-listing: DEBUG: Generating listing for /media/css
remote: markdoc.build-listing: DEBUG: cp /media/css/_list.html /media/css/index.
html
remote: ==== Beginning rsync ====
remote: sending incremental file list
remote: ./
remote: index.html
remote: media/
remote: media/index.html
remote: media/css/
remote: media/css/index.html
remote: media/sass/
remote: media/sass/index.html
remote:
remote: sent 10,279 bytes  received 115 bytes  20,788.00 bytes/sec
remote: total size is 17,994  speedup is 1.73
remote: ==== Cleaning up temporary files ====
To ssh://lws_lws@ssh.phx.nearlyfreespeech.net:/home/private/git/morrowind-dnd3.5
/
   e311a6f..c608a32  master -> master

C:\Users\lws\Documents\GitHub\morrowind-dnd3.5>
```

## Tips

Markdoc assumes that you will have the following in your `.htaccess` file, to rewrite requests for `/page` to `/page.html`.

```
Options +MultiViews

<FilesMatch "\.html$">
  ForceType 'application/xhtml+xml; charset=UTF-8'
</FilesMatch>
```

## Public Key Authentication

TODO: Add instructions for setting up public key auth.