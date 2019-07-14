## Simple Puppeteer QlikSense Example

### Endpoints


GET **/capture/awaitdiv/:div/filename/:filename/width/:width/height/:height/url/*** - returns url to screenshot

GET **/static/images/** - returns the image with a given name


### Installing

`cd PuppeteerQs`

`npm install`

### Usage

* Run a get request or navigate with browser to **/capture/awaitdiv/:div/filename/:filename/width/:width/height/:height/url/***
The parameter awaitdiw takes a div element from the DOM and waits for it to finish rendering. 

* Download or embed you image into an email via the download url **/static/images/**

### Qlik Sense Service Dispatcher Integration

* Copy the files manually with admin priviliges into  
```C:\Program Files\Qlik\Sense\ServiceDispatcher\Node\PuppeteerQs\```  

* Then append the following configuration options to  
```C:\Program Files\Qlik\Sense\ServiceDispatcher\services.conf```  
This will let the Service Dispatcher know how to run the module, this step has to be re-applied in an upgrade of Qlik Sense Server.

```
[puppeteerqs]
Identity=Qlik.puppeteerqs
Enabled=true
DisplayName=puppeteerqs
ExecType=nodejs
ExePath=Node\node.exe
Script=Node\PuppeteerQs\server\server.js

[puppeteerqs.parameters]
```

Adjust ```./src/config/config.json``` to work with a Qlik Sense Server like this:

```
{
    "engineHost": "<your Qlik Sense Server hostname or IP>",
    "userDirectory": "<your user directory>",
    "userId": "<your user>",
    "certificatesPath": "C:/ProgramData/Qlik/Sense/Repository/Exported Certificates/.Local Certificates",
    "port": 1337,
    "headless": true
}

```


### Usage

#### Config

See [config.json](./src/config.json) for configurations.

Start on Qlik Sense server with `npm start` or integrate into Qlik Sense ServiceDispatcher.

Navigate with browser or other tools to `http://<qlik sense server name>:1337/<endpoint>`

### Author

**Henrik Amnäs**

* [MillnetBI](http://millnetbi.se/)

### License

Copyright © 2019 Henrik Amnäs

Released under the MIT license.

***
