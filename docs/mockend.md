# mockend

Provide test APIs 

REST API
```shell
http https://mockend.com/xmlking/svelte-starter-kit/members
http https://mockend.com/xmlking/svelte-starter-kit/members/1
http https://mockend.com/xmlking/svelte-starter-kit/addresses
http https://mockend.com/xmlking/svelte-starter-kit/addresses/1
```

GraphQL APIs
```shell
https://mockend.com/xmlking/svelte-starter-kit/graphql?query=%7B%0A%20%20members(limit%3A%205)%20%7B%0A%20%20%20%20firstName%0A%20%20%20%20lastName%0A%20%20%20%20email%0A%20%20%20%20phone%0A%20%20%20%20addresses%20%7B%0A%20%20%20%20%20%20street%0A%20%20%20%20%20%20city%0A%20%20%20%20%20%20state%0A%20%20%20%20%20%20zip%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%20
```
