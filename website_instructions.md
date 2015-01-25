
This guide gives instructions on how to set up a Markdoc wiki on a NearlyFreeSpeech web hosting account.

The content for the wiki will be kept in a Git repository. Pushing the repository to the webserver will cause the website to be freshly rebuilt.

The instructions assume you are working on a Windows computer; it should be even easier than this if you are using OSX or Linux.

# Server side setup

Log into your NearlyFreeSpeech website via SSH and perform the following steps:

1. Install Markdoc: `easy_install --user markdoc`
2. Add this line to the top of your `
2. Initialise a new, bare, git repository: `git init /home/private/git/mywiki --bare`. Note your choice of directory for later.
3. 

# Windows desktop setup

You will work on the website content on your Windows desktop, pushing the changes to the NearlyFreeSpeech.Net server when you are ready to publish the website.

Where `terminal commands` are shown, execute these in a `cmd.exe` or Powershell window.

1. Install Python 2, `pip`, and git. If you use Chocolatey (the Windows equivalent of apt-get) then this is a simple matter of running `cinst python2 pip git` as Administrator. Otherwise, go to the appropriate websites, download the software installers and run them.
3. Install Markdoc: `pip install markdoc` (as Administrator)
4. Initialise new wiki: `markdoc.exe init --vcs-ignore git C:\mywiki\`
5. Goto new wiki: `cd C:\mywiki`
6. Initialise new git repository: `git init .`
7. Add git remote: `git remote add nfsn ssh://<username>_<site>@ssh.<servername>.nearlyfreespeech.net:/home/private/git/mywiki`.
	* `nfsn` is a short nickname you will use when pushing to the web host, i.e. `git push nfsn`.
	* `username` is your NearlyFreeSpeech.net username.
	* `sitename` is your NearlyFreeSpeech.net site name.
	* `/home/private/git/mywiki` is the path to your wiki from Step 2 of the server-side setup, above.
8. Create some content, say in `test.md`
9. Push website up to web host - `git push nfsn`

Tips:

* If you set up public-key authentication, you won't have to type your NearlyFreeSpeech.Net password every time you do a `git push nfsn`.

# Public Key Authentication

Follow 