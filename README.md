# Simple Chain

This is a start implementation of a simple chain blockchain being cosumed by restful apis using Hapi.js framework.

## Getting Started

### Prerequisites

You need the LTS verion of node installed in your machine. You can get it here : https://nodejs.org/en/

### Installing

After having the node installed you can fork this project into your account and clone it. In the root folder of the project execute:

```
npm install
```

And to start the project you need to run:

```
npm start
```

### Configuration

Inside of the project you have a .env folder that contains a config folder inside with a json that you can add your enviroments configurations of host and port:

```
{
    "<YOUR_ENV>" : {
        "host" : "<YOUR_HOST>",
        "port" : "<YOUR_PORT>"
    }
}
```

By default if you don't specify any environment the project will use the dev configured already. If you want to use your configuration you can execute the project like this:

```
ENV=<YOUR_ENV> npm start
```

## Endpoints

### GET /block/{block_height}

In this enspoint you can get the block height disared by appsing at the end of path param;

### POST /block

In this enpoin you can add a new block to the chain the body should contain some data to be able to add the bew block

## Built With
* [Node.js](https://nodejs.org/)
* [Hapi.js](https://hapijs.com/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Guilherme NMDfc** - *Initial work*
