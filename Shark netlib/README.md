# Shark netlib

Install: `npm i shark-netlib`

Example:
```js

const shnet=require("shark-netlib");
shnet("https://example.com").then((body)=>{console.log(body);}, (err)=>{console.error("an error occured");});//DETECT IF IT IS http or https and use the correct function
```

