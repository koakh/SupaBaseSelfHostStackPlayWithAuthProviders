# NOTES

- [NOTES](#notes)
  - [Project Folders](#project-folders)
  - [TLDR](#tldr)
  - [Create Ory Hydra Client](#create-ory-hydra-client)
    - [Creating an OAuth 2.0 Client](#creating-an-oauth-20-client)
    - [Perform the client credentials grant](#perform-the-client-credentials-grant)
    - [Perform token introspection on that token](#perform-token-introspection-on-that-token)
  - [Change in GoTrue Project](#change-in-gotrue-project)
  - [Try Client with NextJs Project](#try-client-with-nextjs-project)
    - [Error #1 : The 'redirect_uri' parameter does not match any of the OAuth 2.0 Client's pre-registered redirect urls.](#error-1--the-redirect_uri-parameter-does-not-match-any-of-the-oauth-20-clients-pre-registered-redirect-urls)
      - [Test Login](#test-login)
    - [Error #2 : Error getting user email from external provider](#error-2--error-getting-user-email-from-external-provider)
    - [Error #3 : The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed. Redirect URL is using an insecure protocol, http is only allowed for hosts with suffix `localhost`, for example: http://myapp.localhost/.](#error-3--the-request-is-missing-a-required-parameter-includes-an-invalid-parameter-value-includes-a-parameter-more-than-once-or-is-otherwise-malformed-redirect-url-is-using-an-insecure-protocol-http-is-only-allowed-for-hosts-with-suffix-localhost-for-example-httpmyapplocalhost)
    - [Error #4 : Error getting user email from external provider : Part II ?](#error-4--error-getting-user-email-from-external-provider--part-ii-)
    - [Error #5 : json: cannot unmarshal object into Go value of type []*provider.oryhydraUserEmail](#error-5--json-cannot-unmarshal-object-into-go-value-of-type-provideroryhydrauseremail)
    - [Error #6 :  relation "identities" does not exist (SQLSTATE 42P01)](#error-6---relation-identities-does-not-exist-sqlstate-42p01)
    - [Problem #7 : oauth2: cannot fetch token: 400 Bad Request\nResponse: {\"error\":\"invalid_grant\",\"error_description\":\"The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client. The authorization code has already been used.\"}s](#problem-7--oauth2-cannot-fetch-token-400-bad-requestnresponse-errorinvalid_granterror_descriptionthe-provided-authorization-grant-eg-authorization-code-resource-owner-credentials-or-refresh-token-is-invalid-expired-revoked-does-not-match-the-redirection-uri-used-in-the-authorization-request-or-was-issued-to-another-client-the-authorization-code-has-already-been-useds)
    - [Build Image Production](#build-image-production)
    - [Problem #008 Unable to find email with OryHydra provider](#problem-008-unable-to-find-email-with-oryhydra-provider)
    - [Problem #009: fails with `Error missing provider id`](#problem-009-fails-with-error-missing-provider-id)
    - [Problem #0010: All Providers Login fail running SupaAUth docker images but work running with `yarn dev`](#problem-0010-all-providers-login-fail-running-supaauth-docker-images-but-work-running-with-yarn-dev)
    - [Problem #011](#problem-011)
    - [Problem #011: failed+to+connect+to+%60host%3Ddb+user%3Dpostgres+database%3Dpostgres%60%3A+server+error](#problem-011-failedtoconnectto60host3ddbuser3dpostgresdatabase3dpostgres603aservererror)
    - [Problem #012 Working with InBucket Smtp and Redirect to](#problem-012-working-with-inbucket-smtp-and-redirect-to)

## Project Folders

## TLDR

```shell
$ make buidd
$ ./hack/postgresd.sh
$ ./gotrue -c example.env 
# tldr
$ make build && ./gotrue -c example.env 
```

add oryhydra provider

cp api/provider/gitlab.go api/provider/oryhydra.go

replace 

```shell
$ curl -s localhost:9999/settings | jq .external
# outcome
...
  "oryhydra": false
}
```

add to `example.env`

```shell
# Ory OAuth config
GOTRUE_EXTERNAL_ORYHYDRA_ENABLED=true
GOTRUE_EXTERNAL_ORYHYDRA_CLIENT_ID=testclientid
GOTRUE_EXTERNAL_ORYHYDRA_SECRET=testsecret
GOTRUE_EXTERNAL_ORYHYDRA_REDIRECT_URI=https://identity.services.netlify.com/callback
GOTRUE_EXTERNAL_ORYHYDRA_URL=https://oryhydra.example.com/auth/realms/myrealm
```

```shell
$ curl -s localhost:9999/settings | jq .external
# outcome
...
  "oryhydra": true
}
```

- [https://www.ory.sh/.well-known/openid-configuration](https://www.ory.sh/.well-known/openid-configuration)


```shell
$ curl http://localhost:4444/.well-known/openid-configuration | jq
{
  "issuer": "https://kuartzo.com:444/",
  "authorization_endpoint": "https://kuartzo.com:444/oauth2/auth",
  "token_endpoint": "https://kuartzo.com:444/oauth2/token",
  "jwks_uri": "https://kuartzo.com:444/.well-known/jwks.json",
  "subject_types_supported": [
    "pairwise",
    "public"
  ],
  "response_types_supported": [
    "code",
    "code id_token",
    "id_token",
    "token id_token",
    "token",
    "token id_token code"
  ],
  "claims_supported": [
    "sub"
  ],
  "grant_types_supported": [
    "authorization_code",
    "implicit",
    "client_credentials",
    "refresh_token"
  ],
  "response_modes_supported": [
    "query",
    "fragment"
  ],
  "userinfo_endpoint": "https://kuartzo.com:444/userinfo",
  "scopes_supported": [
    "offline_access",
    "offline",
    "openid"
  ],
  "token_endpoint_auth_methods_supported": [
    "client_secret_post",
    "client_secret_basic",
    "private_key_jwt",
    "none"
  ],
  "userinfo_signing_alg_values_supported": [
    "none",
    "RS256"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ],
  "request_parameter_supported": true,
  "request_uri_parameter_supported": true,
  "require_request_uri_registration": true,
  "claims_parameter_supported": false,
  "revocation_endpoint": "https://kuartzo.com:444/oauth2/revoke",
  "backchannel_logout_supported": true,
  "backchannel_logout_session_supported": true,
  "frontchannel_logout_supported": true,
  "frontchannel_logout_session_supported": true,
  "end_session_endpoint": "https://kuartzo.com:444/oauth2/sessions/logout",
  "request_object_signing_alg_values_supported": [
    "RS256",
    "none"
  ],
  "code_challenge_methods_supported": [
    "plain",
    "S256"
  ]
}
```

## Create Ory Hydra Client

### Creating an OAuth 2.0 Client

```shell
$ CLIENT="supabase-client"
$ SECRET="spzDS7ytp5cEucy9zr7N9oCpXDjZZJPJ"
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint http://127.0.0.1:4445/ \
	--id "${CLIENT}" \
	--secret "${SECRET}" \
	--grant-types client_credentials
# outcome
OAuth 2.0 Client ID: supabase-client
```

`supabase-client` created

> note for `--id supabase-client` and `--secret secret`

### Perform the client credentials grant

> grant seems that is only for credentials clients

Let's perform the client credentials grant:

```shell
$ docker-compose -f quickstart.yml exec hydra \
	hydra token client \
	--endpoint http://127.0.0.1:4444/ \
	--client-id "${CLIENT}" \
	--client-secret "${SECRET}"
# outcome: warn it have a breakline, remove if want to store in variable
GG0izUhrF8IzvxCPh0xNUdwXbnMGYq8I4f5-MLbcSgw.1FzvzjoYzYf3Vhb-AQD5pUeZFS_0LAFpa-tbfu5qkHg
```

> note for `--id supabase-client` and `--secret secret`

### Perform token introspection on that token

Let's perform token introspection on that token. Make sure to copy the token you just got and not the dummy value.

```shell
$ TOKEN="GG0izUhrF8IzvxCPh0xNUdwXbnMGYq8I4f5-MLbcSgw.1FzvzjoYzYf3Vhb-AQD5pUeZFS_0LAFpa-tbfu5qkHg"
$ docker-compose -f quickstart.yml exec hydra \
    hydra token introspect \
    --endpoint http://127.0.0.1:4445/ \
    ${TOKEN}
# outcome
{
	"active": true,
	"aud": [],
	"client_id": "supabase-client",
	"exp": 1657579179,
	"iat": 1657575579,
	"iss": "https://kuartzo.com:444/",
	"nbf": 1657575579,
	"sub": "supabase-client",
	"token_type": "Bearer",
	"token_use": "access_token"
}
```

## Change in GoTrue Project

## Try Client with NextJs Project

### Error #1 : The 'redirect_uri' parameter does not match any of the OAuth 2.0 Client's pre-registered redirect urls.

after change `kong.yml` to use host machine ex 
and `example.env`

```shell
DATABASE_URL="postgres://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres"
API_EXTERNAL_URL="http://172.17.0.1:9999"
GOTRUE_API_HOST="172.17.0.1"
```

```
Description: The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed. The 'redirect_uri' parameter does not match any of the OAuth 2.0 Client's pre-registered redirect urls.
```

#### Test Login

// TODO: copy to hydra notes if works

- [Error : The &quot;redirect_uri&quot; parameter does not match any of the OAuth 2.0 Client&#39;s pre-registered redirect urls · Issue #1245 · ory/hydra](https://github.com/ory/hydra/issues/1245)

callbacks or redirect must be `http://localhost:8000/auth/v1/callback`

```shell
$ CLIENT="supabase-client-oauth-pkce-14"
$ curl -s -X GET "http://localhost:4445/clients/${CLIENT}" | jq .redirect_uris
[]
```

// TODO:

```shell
$ CLIENT="supabase-client"
$ SECRET="spzDS7ytp5cEucy9zr7N9oCpXDjZZJPJ"
$ docker-compose -f quickstart.yml exec hydra \
  hydra token user \
    --skip-tls-verify \
    --endpoint http://kuartzo.com \
    --port 3000 \
    --auth-url http://127.0.0.1:4444/oauth2/auth \
    --token-url http://127.0.0.1:4444/oauth2/token \
    --client-id supabase-client \
    --client-secret some-secret \
    --scope openid,offline,photos.read
# outcome
Setting up home route on http://127.0.0.1:3000/
Setting up callback listener on http://127.0.0.1:3000/callback
Press ctrl + c on Linux / Windows or cmd + c on OSX to end the process.
If your browser does not open automatically, navigate to:

	http://127.0.0.1:3000/
```

> --endpoint don't seems to do anything

// TODO: change consent app port to 4446
-p, --port int               The port on which the server should run (default 4446)

try create a OAuth 2.0 Authorization Code Grant

// TODO: old grant authorization_code,refresh_token
<!-- "grant_types_supported": [
  "authorization_code",
  "implicit",
  "client_credentials",
  "refresh_token"
], -->

// TODO: THE REAL CLIENT

```shell
$ CLIENT="supabase-client-oauth-pkce-14"
$ docker-compose -f quickstart.yml exec hydra \
	hydra clients create \
	--endpoint http://127.0.0.1:4445 \
	--id "${CLIENT}" \
  --token-endpoint-auth-method client_secret_post \
	--grant-types client_credentials,authorization_code,implicit,refresh_token \
	--response-types code,id_token \
	--scope openid,profile,email,offline_access,phone \
	--callbacks http://localhost:9999/callback \
  --allowed-cors-origins http://localhost:3030
# outcome
# OAuth 2.0 Client ID: supabase-client-oauth-pkce-13
# OAuth 2.0 Client Secret: .lZbO5k8wJVsBHkPaSTQyM4BZG
OAuth 2.0 Client ID: supabase-client-oauth-pkce-14
OAuth 2.0 Client Secret: 359XOMNiLpDT8sRN6BA6UjB.y4
```

> NOTE: for generated client secret after we add `--token-endpoint-auth-method client_secret_post`, with `--token-endpoint-auth-method  none` will show `This OAuth 2.0 Client has no secret`, seems that this is step forword

with this client it show login and go to call back with the infamous

GET
	http://localhost:3030/oryhydra?error=server_error&error_description=Unable to exchange external code: S5qF8YljVXr4-kY8xtnbmFjydOVuMw6ZnhtG3NBqQXo.gZ1lscAi__C-Mo91-u8QdfLLYNTHG-wRAKDkenoXx7E

gotrue log

ERRO[0089] 500: Unable to exchange external code: S5qF8YljVXr4-kY8xtnbmFjydOVuMw6ZnhtG3NBqQXo.gZ1lscAi__C-Mo91-u8QdfLLYNTHG-wRAKDkenoXx7E  component=api error="oauth2: cannot fetch token: 401 Unauthorized\nResponse: {\"error\":\"invalid_client\",\"error_description\":\"Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method). The OAuth 2.0 Client supports client authentication method 'none', but method 'client_secret_post' was requested. You must configure the OAuth 2.0 client's 'token_endpoint_auth_method' value to accept 'client_secret_post'.\"}" method=GET path=/callback referer= remote_addr="172.28.0.4:58386" request_id=5c0b9581-5991-4876-a005-05ea71ac7cd9
INFO[0089] request completed                             component=api duration=190233514 method=GET path=/callback referer= remote_addr="172.28.0.4:58386" request_id=5c0b9581-5991-4876-a005-05ea71ac7cd9 status=302

- [Issue a Token via rest problems](https://community.ory.sh/t/issue-a-token-via-rest-problems/700)

we see above in the client `--token-endpoint-auth-method none` let change it to `--token-endpoint-auth-method client_secret_post` like is sugested in gotrue log

seems that pass now appears other error

### Error #2 : Error getting user email from external provider

gotrue console

```shell
INFO[1210] request started                               component=api method=GET path=/authorize referer="http://localhost:3030/" remote_addr="172.28.0.4:38626" request_id=fbfeaf7a-33b3-41c6-976e-63a4a2e6b001
INFO[1210] Redirecting to external provider              component=api method=GET path=/authorize provider=oryhydra referer="http://localhost:3030/" remote_addr="172.28.0.4:38626" request_id=fbfeaf7a-33b3-41c6-976e-63a4a2e6b001
INFO[1210] request completed                             component=api duration=229795 method=GET path=/authorize referer="http://localhost:3030/" remote_addr="172.28.0.4:38626" request_id=fbfeaf7a-33b3-41c6-976e-63a4a2e6b001 status=302
INFO[1217] request started                               component=api method=GET path=/callback referer= remote_addr="172.28.0.4:38626" request_id=45a13c11-1c16-41a0-9a13-85cafe95f2f8
ERRO[1218] 500: Error getting user email from external provider  component=api error="404: <!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>404 - Route not found</title>\n    <style>*{transition:all .6s}html{height:100%!}(MISSING)body{font-family:sans-serif;color:#888;margin:0}#main{display:table;width:100%!;(MISSING)height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;margin-bottom:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style>\n</head>\n<body translate=\"no\">\n<div id=\"main\">\n    <div class=\"fof\">\n        <h1>Error 404</h1>\n        <p>The requested route does not exist. Make sure you are using the right path, domain, and port.</p>\n    </div>\n</div>\n</body>\n</html>" method=GET path=/callback referer= remote_addr="172.28.0.4:38626" request_id=45a13c11-1c16-41a0-9a13-85cafe95f2f8
INFO[1218] request completed                             component=api duration=443719695 method=GET path=/callback referer= remote_addr="172.28.0.4:38626" request_id=45a13c11-1c16-41a0-9a13-85cafe95f2f8 status=302
```

seems that this is not a valid json response `Error getting user email from external provider  component=api error="404: <!DOCTYPE html>\n<html lang=\"en\">\n<head>\n

the problem is that we are redirect to keycloak fuck `http://localhost:8000/auth/v1/callback` and not to gotrue at `http://172.17.0.1:9999/callback`

```shell
# GOTRUE_EXTERNAL_ORYHYDRA_REDIRECT_URI="http://localhost:8000/auth/v1/callback"
# trick is using gotrue here and with docker else `Firefox can’t establish a connection to the server at localhost:9999.` 
GOTRUE_EXTERNAL_ORYHYDRA_REDIRECT_URI="http://172.17.0.1:9999/callback"
GOTRUE_EXTERNAL_ORYHYDRA_URL="https://kuartzo.com:444"
```

### Error #3 : The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed. Redirect URL is using an insecure protocol, http is only allowed for hosts with suffix `localhost`, for example: http://myapp.localhost/.

```shell
error_description
	The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed. Redirect URL is using an insecure protocol, http is only allowed for hosts with suffix `localhost`, for example: http://myapp.localhost/.
```

try change 

```shell
GOTRUE_EXTERNAL_ORYHYDRA_REDIRECT_URI="http://localhost:9999/callback"
```

localhost don't work because of gotrue 

```shell
API_EXTERNAL_URL="http://172.17.0.1:9999"
GOTRUE_API_HOST="172.17.0.1"
```

```shell
API_EXTERNAL_URL="http://0.0.0.0:9999"
GOTRUE_API_HOST="0.0.0.0"
```

now it works but we have one more


### Error #4 : Error getting user email from external provider : Part II ?

```shell
INFO[0490] request started                               component=api method=GET path=/callback referer= remote_addr="127.0.0.1:58402" request_id=f3e3315d-ddca-4846-aa01-252668166d8a
ERRO[0491] 500: Error getting user email from external provider  component=api error="404: <!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>404 - Route not found</title>\n    <style>*{transition:all .6s}html{height:100%!}(MISSING)body{font-family:sans-serif;color:#888;margin:0}#main{display:table;width:100%!;(MISSING)height:100vh;text-align:center}.fof{display:table-cell;vertical-align:middle}.fof h1{font-size:50px;display:inline-block;padding-right:12px;margin-bottom:12px;animation:type .5s alternate infinite}@keyframes type{from{box-shadow:inset -3px 0 0 #888}to{box-shadow:inset -3px 0 0 transparent}}</style>\n</head>\n<body translate=\"no\">\n<div id=\"main\">\n    <div class=\"fof\">\n        <h1>Error 404</h1>\n        <p>The requested route does not exist. Make sure you are using the right path, domain, and port.</p>\n    </div>\n</div>\n</body>\n</html>" method=GET path=/callback referer= remote_addr="127.0.0.1:58402" request_id=f3e3315d-ddca-4846-aa01-252668166d8a
INFO[0491] request completed                             component=api duration=433423956 method=GET path=/callback referer= remote_addr="127.0.0.1:58402" request_id=f3e3315d-ddca-4846-aa01-252668166d8a status=302
```

- [hydra token user&#39;s callback url is hardcoded · Issue #307 · ory/hydra](https://github.com/ory/hydra/issues/307)

I follow the tutorial and it's working except the last step, which is redirect to the callback url, the url is hardcoded to "http://localhost:4445/callback".

founded the html outputed above is from <https://kuartzo.com:445/callback> that proves that this is not ok

the fix for html is replace with this if `err := makeRequest(ctx, tok, g.Config, g.Host+"/userinfo", &u); err != nil {`
the ory user info authorization_endpoint

### Error #5 : json: cannot unmarshal object into Go value of type []*provider.oryhydraUserEmail

commented 

```golang
	// var emails []*oryhydraUserEmail
	// if err := makeRequest(ctx, tok, g.Config, g.Host+"/api/v4/user/emails", &emails); err != nil {
	// 	return nil, err
	// }

	// for _, e := range emails {
	// 	// additional emails from OryHydra don't return confirm status
	// 	if e.Email != "" {
	// 		data.Emails = append(data.Emails, Email{Email: e.Email, Verified: false, Primary: false})
	// 	}
	// }

	// if u.Email != "" {
	// 	verified := u.ConfirmedAt != ""
	// 	data.Emails = append(data.Emails, Email{Email: u.Email, Verified: verified, Primary: true})
	// }

	// if len(data.Emails) <= 0 {
	// 	return nil, errors.New("Unable to find email with OryHydra provider")
	// }
```

now it reach same point of other two providers, github and kycloak

error_description
	ERROR: relation "identities" does not exist (SQLSTATE 42P01)

### Error #6 :  relation "identities" does not exist (SQLSTATE 42P01)

this seeems that is a because of running image outside of conatiner

fuck it not works because of this rename `migrations_HIDDEN`, change to `migrations` and

and change to `DATABASE_URL="postgres://supabase_auth_admin:root@localhost:5432/postgres"` again

change hack postgres port to 5432 and

```shell
$ ./hack/postgresd.sh

$ make build && ./gotrue -c example.env migrate
# outcome
DEBU[0000] Reading migrations from ./migrations         
DEBU[0000] before status                                
Version          Name                          Status    
00               init_auth_schema              Applied   
20210710035447   alter_users                   Applied   
20210722035447   adds_confirmed_at             Applied   
20210730183235   add_email_change_confirmed    Applied   
20210909172000   create_identities_table       Applied   
20210927181326   add_refresh_token_parent      Applied   
20211122151130   create_user_id_idx            Applied   
20211124214934   update_auth_functions         Applied   
20211202183645   update_auth_uid               Applied   
20220114185221   update_user_idx               Applied   
20220114185340   add_banned_until              Applied   
20220224000811   update_auth_functions         Applied   
20220323170000   add_user_reauthentication     Applied   
20220429102000   add_unique_idx                Applied   
20220531120530   add_auth_jwt_function         Applied   
20220614074223   add_ip_address_to_audit_log   Applied   
DEBU[2022-07-13T01:30:24.458352969+01:00] Set log level to: debug                      
INFO[0000] GoTrue API started on: 0.0.0.0:9999    
```

now it pass db problem

### Problem #7 : oauth2: cannot fetch token: 400 Bad Request\nResponse: {\"error\":\"invalid_grant\",\"error_description\":\"The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client. The authorization code has already been used.\"}s

```shell
[POP] 2022/07/13 23:09:30 sql - SELECT identities.created_at, identities.id, identities.identity_data, identities.last_sign_in_at, identities.provider, identities.updated_at, identities.user_id FROM identities AS identities WHERE id = $1 AND provider = $2 LIMIT 1 | ["0" "oryhydra"]
INFO[0023] request completed                             component=api duration=5165559590 method=GET path=/callback referer= remote_addr="127.0.0.1:43190" request_id=6450161f-2f85-4197-adde-b426761d8828 status=0
2022/07/13 23:09:30 http: panic serving 127.0.0.1:43190: runtime error: index out of range [0] with length 0
goroutine 69 [running]:
net/http.(*conn).serve.func1()
        /usr/lib64/go/1.17/src/net/http/server.go:1802 +0xb9
panic({0xe62540, 0xc00003a6c0})

...

INFO[0050] request started                               component=api method=GET path=/callback referer= remote_addr="127.0.0.1:45110" request_id=2098cf15-97fb-4ce9-b380-d52a3b0bcd4a
ERRO[0050] 500: Unable to exchange external code: OLtfL8f59zfeIuQp0KZkhtieqTc6iymgOUysNzBKBAY.YAtTJHf4aaV8VQjLMjZYNhg4FXvPdaxUiFVqi3tcKvU  component=api error="oauth2: cannot fetch token: 400 Bad Request\nResponse: {\"error\":\"invalid_grant\",\"error_description\":\"The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client. The authorization code has already been used.\"}" method=GET path=/callback referer= remote_addr="127.0.0.1:45110" request_id=2098cf15-97fb-4ce9-b380-d52a3b0bcd4a
INFO[0050] request completed                             component=api duration=176397495 method=GET path=/callback referer= remote_addr="127.0.0.1:45110" request_id=2098cf15-97fb-4ce9-b380-d52a3b0bcd4a status=302
```

inspect db with beekeeper we see that we don't have table indentities and are missing full migrations

drop volumes

```shell
$ docker volume remove postgres_data
postgres_data
```
and restart again

```shell
$ ./hack/postgresd.sh
b3f21ec34b89df43072fdb534384f4a5265ac38ae646fe4bdb25ba3d8e6d0f09
```

now it works giving zero records

```
SELECT * FROM auth.identities WHERE id = '0' AND provider = 'oryhydra' LIMIT 1
```

all providers fail, try with builded image

### Build Image Production

```shell
$ docker image ls | grep gotrue
supabasegotruerepo_gotrue                      latest                         4edfa999f1ab   About a minute ago   1.12GB
supabase/gotrue                                latest                         4c34c64d9883   8 days ago           33.3MB
supabase/gotrue                                v2.7.2                         4c34c64d9883   8 days ago           33.3MB
supabase/gotrue                                v2.5.21                        46c55335d891   4 months ago         32.9MB
```

1.12gb image?

use production `Dockerfile`, change `dockerfile`

```yml
version: "3.9"
services:
  gotrue:
    build:
      context: ./
      # dockerfile: Dockerfile.dev
      dockerfile: Dockerfile
```

now it's a lot smaller, from `1.12GB` to `33.4MB`

```shell
$ docker-compose -f docker-compose-dev.yml build
$ docker image ls | grep gotrue
supabasegotruerepo_gotrue                      latest                         9a6d9c6de0d8   6 seconds ago    33.4MB
```

with builded image and running full stack **github and keycloak works, ory hydra to, its enabled**, but crash here

### Problem #008 Unable to find email with OryHydra provider

after change oryhydra provider code with slack now it works without errors, but fails in get email `Error getting user email from external provider`

```shell
supabase-auth | time="2022-07-13T23:20:42Z" level=error msg="500: Error getting user email from external provider" component=api error="Unable to find email with Slack provider" method=GET path=/callback referer= remote_addr="172.30.0.1:54626" request_id=24bdc4cf-8019-4dd0-b34b-57f164562bdd
supabase-auth | time="2022-07-13T23:20:42Z" level=info msg="request completed" component=api duration=4748056711 method=GET path=/callback referer= remote_addr="172.30.0.1:54626" request_id=24bdc4cf-8019-4dd0-b34b-57f164562bdd status=302
```

fixed commented

```go
// TODO:
// if u.Email == "" {
// 	return nil, errors.New("Unable to find email with OryHydra provider")
// }
```

UPDATE: the real fix is using `u.Sub`

```go
if u.Sub == "" {
  return nil, errors.New("Unable to find email with OryHydra provider")
}
```

### Problem #009: fails with `Error missing provider id`

after this it fails with `Error missing provider id`, 
this time I found that we must **get properties from jwt**
for this we log in <https://kuartzo.com:810> and decode `idToken` ex

```json
{
  "acr": "0",
  "at_hash": "6X3uPYUvbA4wLLS6Z4iqMg",
  "aud": [
    "oauth-pkce5"
  ],
  "auth_time": 1657755117,
  "exp": 1657758727,
  "iat": 1657755127,
  "iss": "https://kuartzo.com:444/",
  "jti": "464c736d-6fb0-4f8a-8fe0-e93e42ef7478",
  "permissions": [
    "create:items",
    "update:items",
    "delete:items"
  ],
  "rat": 1657755113,
  "roles": [
    "ROLE_USER",
    "ROLE_ADMIN"
  ],
  "sid": "9b5ac687-659d-4b56-a33d-db259dd93912",
  "sub": "foo@bar.com"
}
```

here we replace `ProviderId: u.Id` with `ProviderId: u.Iss`

and after this build a new image it starts to work


localStorage: `supabase.auth.token`

```json
{
  "currentSession": {
    "provider_token": "tLKVe3stzKWuqfk9SkpJZYAt3PtEt_LAJDCM9mds_So.liThnK1F9b1um-cR-cWobDxnRybvP34C4ACB4y1Xors",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjU3NzU4ODAzLCJzdWIiOiJhZWM5ZmNlYi1hNmI5LTRiYTYtYTI2OS00YmRhYmQxZTQzZjAiLCJlbWFpbCI6IiIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoib3J5aHlkcmEiLCJwcm92aWRlcnMiOlsib3J5aHlkcmEiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8va3VhcnR6by5jb206NDQ0IiwicHJvdmlkZXJfaWQiOiJmb29AYmFyLmNvbSIsInN1YiI6ImZvb0BiYXIuY29tIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIn0.rLJTrMCX4-ivEqWESvyN37F1mZ7y194z0xWXv1nf-aU",
    "expires_in": 3600,
    "expires_at": 1657758805,
    "refresh_token": "mqSjXRFypqmRfMMWz6Q2JA",
    "token_type": "bearer",
    "user": {
      "id": "aec9fceb-a6b9-4ba6-a269-4bdabd1e43f0",
      "aud": "authenticated",
      "role": "authenticated",
      "email": "",
      "email_confirmed_at": "2022-07-13T23:33:23.194833Z",
      "phone": "",
      "confirmed_at": "2022-07-13T23:33:23.194833Z",
      "last_sign_in_at": "2022-07-13T23:33:23.19542Z",
      "app_metadata": {
        "provider": "oryhydra",
        "providers": [
          "oryhydra"
        ]
      },
      "user_metadata": {
        "email_verified": true,
        "iss": "https://kuartzo.com:444",
        "provider_id": "foo@bar.com",
        "sub": "foo@bar.com"
      },
      "identities": [
        {
          "id": "foo@bar.com",
          "user_id": "aec9fceb-a6b9-4ba6-a269-4bdabd1e43f0",
          "identity_data": {
            "email_verified": true,
            "iss": "https://kuartzo.com:444",
            "provider_id": "foo@bar.com",
            "sub": "foo@bar.com"
          },
          "provider": "oryhydra",
          "last_sign_in_at": "2022-07-13T23:33:23.192872Z",
          "created_at": "2022-07-13T23:33:23.192923Z",
          "updated_at": "2022-07-13T23:33:23.192927Z"
        }
      ],
      "created_at": "2022-07-13T23:33:23.188584Z",
      "updated_at": "2022-07-13T23:33:23.198407Z"
    }
  },
  "expiresAt": 1657758805
}
```

### Problem #0010: All Providers Login fail running SupaAUth docker images but work running with `yarn dev` 

the problem is strange we login and everything works, no errors, but we simple return to login page

- [Basic Features: Environment Variables | Next.js](https://nextjs.org/docs/basic-features/environment-variables#default-environment-variables)

here what we found is that we need to **build image** and **run image** with a accesible `NEXT_PUBLIC_SUPABASE_URL` ex `NEXT_PUBLIC_SUPABASE_URL=http://172.17.0.1:8000`

when nextjs builds bundle it hard code this in bundle on build step, and this and env variable in `.env.production` is what makes it works

read comments in `.env.production` etc
to work better we rename `.env.local` to `.env.dev`, else build steps read both at build time

```shell
# build image
$ next build
# if next detects both files, .env.production can't override NEXT_PUBLIC_SUPABASE_URL value
# info  - Loaded env from /app/.env.local
# info  - Loaded env from /app/.env.production
```

now it only detect `.env.production`

```shell
# build image
$ next build
# if next detects both files, .env.production can't override NEXT_PUBLIC_SUPABASE_URL value
# info  - Loaded env from /app/.env.production
```

`.env.production`

```shell
# used in start, build process, ex in build, build image and inside docker ad default env file `info  - Loaded env from /app/.env.production`
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
NEXT_PUBLIC_SUPABASE_STORAGE=
# use for local and supabase stack without requiring `127.0.0.1 kong` on hosts
NEXT_PUBLIC_SUPABASE_URL=http://172.17.0.1:8000
```
debug with

```shell
$ docker exec -it 0f858a726d01 sh
/app $ echo ${NEXT_PUBLIC_SUPABASE_URL}
# outcome
http://172.17.0.1:8000
```

### Problem #011

SupaBase and user with empty Email field, and in auth redirect appears **Howdie, explorer!** and not **Howdie, foo@bar.com!**, because of a null supabasse email (db)

cookieKey: `sb-access-token`
cookieValue: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjU4MDk2NjM0LCJzdWIiOiIzMTE2MmUyYi0wNzY2LTQ5ZDktODNiYS1mOGU0YmZjZTFlMzIiLCJlbWFpbCI6ImZvb0BiYXIuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCIsIm9yeWh5ZHJhIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiZm9vQGJhci5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9rdWFydHpvLmNvbTo0NDQiLCJwcm92aWRlcl9pZCI6Imh0dHBzOi8va3VhcnR6by5jb206NDQ0LyIsInN1YiI6ImZvb0BiYXIuY29tIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIn0.sPh1jn-_RtfmBqLBvWMkdLe4OcKJoe4JugWy1szgGLE`

> above token as email, because it is getted after we fix

```json
{
  "aud": "authenticated",
  "exp": 1658096634,
  "sub": "31162e2b-0766-49d9-83ba-f8e4bfce1e32",
  // EMPTY EMAIL, this root values comes from supabase database
  "email": "",
  "phone": "",
  "app_metadata": {
    "provider": "email",
    "providers": [
      "email",
      "oryhydra"
    ]
  },
  // this values comes from oryhydra
  "user_metadata": {
    "email": "foo@bar.com",
    "email_verified": true,
    "iss": "https://kuartzo.com:444",
    "provider_id": "https://kuartzo.com:444/",
    "sub": "foo@bar.com"
  },
  "role": "authenticated"
}
```

the reason is that **oryhydra user is already creater before using Sub**, at this time email property is null, and it create user with **email filed blank**, 
to fix it we must **delete user on supa db and login again**
and now, after login it will be created with email

### Problem #011: failed+to+connect+to+%60host%3Ddb+user%3Dpostgres+database%3Dpostgres%60%3A+server+error

```
http://localhost:3030/oryhydra?error=server_error&error_description=failed+to+connect+to+%60host%3Ddb+user%3Dpostgres+database%3Dpostgres%60%3A+server+error+%28FATAL%3A+could+not+open+file+%22global%2Fpg_filenode.map%22%3A+Permission+denied+%28SQLSTATE+42501%29%29
```

seems that I chown mario:users and this create another problem

revert permissions to db user 999:users

```shell
$ sudo chown 999:users volumes/db/ -R
```

### Problem #012 Working with InBucket Smtp and Redirect to 

first re-disable `ENABLE_EMAIL_AUTOCONFIRM=false` and restart stack

signIn a new user it will create a email in InBucket at <http://localhost:9000/monitor>

```
Confirm your email

Follow this link to confirm your email:

[Confirm your email address](http://localhost:9000/auth/v1/verify?redirect_to=http%3A%2F%2Flocalhost%3A3030%2F&token=c5c642e7985f70da5152c9d5ccf1687f1dba944ee88daccd4fce950e&type=signup)

Alternatively, enter the code: 991851
```

but url is using port of InBucket and not Kong port ex <http://localhost:9000> is <http://localhost:8000>, just change port and it will activate email
confirmed in database and with a login with created user, that works after activation only

- [Inbucket Configurator](https://www.inbucket.org/configurator/)

we can live with that, this mails is just for development and local stack tests