# ***bobTheCoder microservice***

> bobTheCoder Microservice

# Installation guide

```sh
yarn install
```

### Usage

```sh
cd functions 

yarn serve
```

## ***bobTheCoder management service overview*** 
This microservice is designed to be invoked by the ucc-hub portal and contains a number of methods to manage bobTheCoder within the platform.

### ***Incoming Request*** 
When an incoming request is received, the following actions are performed.

1. The payload is validated to ensure only valid data is received and processed by the service. Any non-compliant data is rejected with an appropriate error message.
2. ...

### ***Errors*** 

In the case of an error, the following example shows an error response.

```
{
    "message": "Failed To Update bobTheCoder",
	"data": {
		"message": "Number no longer exists."
	}
}
```
### ***Response Codes***
The service returns the following response codes:
- 200: When the service successfully executes.
- 404: Returned when a service endpoint is not found. e.g. A URL missing the /:email path parameter.
- 406: Returned when validation for the payload has failed.
- 500: This represents an internal error within the service.


## ***bobTheCoder Management Methods***

### **Submit number request**

### Host Url

```
 https://friday.tools.bobthecoder.org
```

# Requirements
1. NodeJS >16.x [Official Website](https://nodejs.org/en/)
2. Firebase CLI [Offical Website](https://firebase.google.com/docs/cli)
3. Google Account (bobthecoder.org)
4. Yarn `npm i -g yarn`

### Comitting and creating Merge Requests

0. Before you start, please create a Personal Access Token. Give it all the possible scopes. Use this as your `password` for when you do git clone or pull for the first time. You may also need to configure your git config:

```bash
git config user.name FirstName
git config user.email firstname.lastname@bobthecoder.com
```

1. First, you need to create a new branch

   - It should be based on the `development` branch.
   - This branch should follow the format of `name/UC-XXXX` for example, `ranjith/UC-9435`.

2. Then, when you're ready, create a new Merge Request

   - Here is a good example of a completed merge request:https://github.com/bob-the-coder-community/next-www/pull/28
   - Set the Source branch as your branch (e.g. `ranjith/UC-9435`) and the Target branch as `development`.
   - Write a small description (there is a template provided).

3. Wait for the `build` pipeline and get Approvals
   - If you click on the progress icon, you'll see it will likely spin off 1-2 build jobs.
   - These jobs run `prettier`, `eslint` and `tsc` checks.
   - Once they're done, you will need **1 approvals** from Developers other than yourself and you can then merge!
   - If you've made a new commit, unfortunately all your existing approvals will be erased.


👤 **Ranjith**
