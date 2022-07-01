# NOTES

## TLDR

- marioammonteiro@gmail.com
- .klweb.......

## Links

- [Project, Setup &amp; Integration feat. Next.js](https://aalam.in/blog/supabase-auth-intro-setup-next)

- [Advanced Features: Debugging | Next.js](https://nextjs.org/docs/advanced-features/debugging)

## SupaBase Project Details

Project URL:
  https://agtwhwsxgdjudvmebpts.supabase.co

Project API keys:
  anon public:

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndHdod3N4Z2RqdWR2bWVicHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTY1MzUxMjEsImV4cCI6MTk3MjExMTEyMX0.lrsmMZ9MHBtr2-qlqTua7ylSdIAi4DB-EBpj8JAHmU0

  service_role secret

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFndHdod3N4Z2RqdWR2bWVicHRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1NjUzNTEyMSwiZXhwIjoxOTcyMTExMTIxfQ.y97-Jk5Fg1_wwZjYCsOJrhdNBtQdZkn6ersT2xVKLQs

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


Client ID: 42851f570f2a75769ef2
Client Secret: 31fd5482299faf6...........