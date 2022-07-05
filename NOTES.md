# NOTES

## TLDR

postgres created user

- mario???????@gmail.com
- ???w?b???

## Links

- [Project, Setup &amp; Integration feat. Next.js](https://aalam.in/blog/supabase-auth-intro-setup-next)

- [Advanced Features: Debugging | Next.js](https://nextjs.org/docs/advanced-features/debugging)

## SupaBase Project Details

Get Details from [Api Settings](https://app.supabase.com/project/agtwhwsxgdjudvmebpts/settings/api)

Project URL:
  https://???????????.supabase.co

Project API keys:
  anon | public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....

  service_role | secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....

and use it in `env.local` ex

```shell
NEXT_PUBLIC_SUPABASE_URL=https://???????????.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
```

## How

### Enabled Show error on Repeated User

- [auth.signUp() doesn&#39;t error for existing accounts - security vulnerability · Issue #296 · supabase/supabase-js](https://github.com/supabase/supabase-js/issues/296)

uncheck **Enable email confirmations** on Authentication settings

### Enable Semi

- [ESLint &#038; Prettier: Enable semi option without complaints - 枫华](https://www.sinocalife.com/eslint-prettier-enable-semi-option-without-complaints)

`.eslintrc.js`

with this it won't remove semi on save with eslint

```js
  rules: {
    'prettier/prettier': [
      'error',
      // the trick to enable semi on save is just use semi: true bellow
      { semi: true },
```

and change `semi: true` on `.prettierrc.js`, with this we can use `npm run prettier` to format whole project adding semi to all files

`.prettierrc.js`

```js
module.exports = {
  semi: true,
};
```

## GitHub OAUth2 Application

![image](attachements/2022-07-01-23-40-45.png)

Client ID: 42851f570f2a...........
Client Secret: 31fd5482299faf6...........
