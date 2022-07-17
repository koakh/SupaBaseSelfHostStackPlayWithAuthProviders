package provider

import (
	"context"
	"errors"
	// "strconv"
	"strings"
	// "fmt"

	"github.com/netlify/gotrue/conf"
	"golang.org/x/oauth2"
)

// OryHydra

const defaultOryHydraAuthBase = "kuartzo.com"

type oryhydraProvider struct {
	*oauth2.Config
	Host string
}

type oryhydraUser struct {
	// Email      string `json:"email"`
	Name        	string `json:"name"`
	AvatarURL   	string `json:"avatar_url"`
	EmailVerified string `json:"email_verified"`
	Sub           string `json:"sub"`
	Iss           string `json:"iss"`
	Phone         string `json:"phone_number"`
	PhoneVerified	bool 	 `json:"phone_number_verified"`
}

// type oryhydraUserEmail struct {
// 	ID    int    `json:"id"`
// 	Email string `json:"email"`
// }

// NewOryHydraProvider creates a OryHydra account provider.
func NewOryHydraProvider(ext conf.OAuthProviderConfiguration, scopes string) (OAuthProvider, error) {
	if err := ext.Validate(); err != nil {
		return nil, err
	}

	oauthScopes := []string{
		"openid",
		"offline_access",
		"email",
		// "phone",
		"profile",
		// "address",
	}

	if scopes != "" {
		oauthScopes = append(oauthScopes, strings.Split(scopes, ",")...)
	}

	host := chooseHost(ext.URL, defaultOryHydraAuthBase)
	return &oryhydraProvider{
		Config: &oauth2.Config{
			ClientID:     ext.ClientID,
			ClientSecret: ext.Secret,
			Endpoint: oauth2.Endpoint{
				// https://oryhydra-server.com:4444/oauth2/auth
				AuthURL:  host + "/oauth2/auth",
				// https://oryhydra-server.com:4444/oauth2/token
				TokenURL: host + "/oauth2/token",
			},
			RedirectURL: ext.RedirectURI,
			Scopes:      oauthScopes,
		},
		Host: host,
	}, nil
}

func (g oryhydraProvider) GetOAuthToken(code string) (*oauth2.Token, error) {
	return g.Exchange(oauth2.NoContext, code)
}

func (g oryhydraProvider) GetUserData(ctx context.Context, tok *oauth2.Token) (*UserProvidedData, error) {
	var u oryhydraUser

	if err := makeRequest(ctx, tok, g.Config, g.Host+"/userinfo", &u); err != nil {
		return nil, err
	}

	// TODO: must get email from oryhydra user, its required, can be Sub ?
	if u.Sub == "" {
		return nil, errors.New("Unable to find email with OryHydra provider")
	}
	// fmt.Printf("%+v \n", u)
	// fmt.Printf("%+v \n", g)

	// $ URL="http://localhost:4444/userinfo"
	// $ curl -s -X GET ${URL} \
	// 	-H "Accept: application/json" \
	// 	-H "Authorization: Bearer ${ACCESS_TOKEN}" \
	// 	| jq
	// {
	// 	"acr": "0",
	// 	"aud": [
	// 		"oauth-pkce5"
	// 	],
	// 	"auth_time": 1657755117,
	// 	"iat": 1657755127,
	// 	"iss": "https://kuartzo.com:444/",
	// 	"permissions": [
	// 		"create:items",
	// 		"update:items",
	// 		"delete:items"
	// 	],
	// 	"rat": 1657755113,
	// 	"roles": [
	// 		"ROLE_USER",
	// 		"ROLE_ADMIN"
	// 	],
	// 	"sub": "foo@bar.com"
	// }	

	return &UserProvidedData{
		Metadata: &Claims{
			Issuer:        g.Host,
			Subject:       u.Sub,
			Name:          u.Name,
			Picture:       u.AvatarURL,
			Email:         u.Sub,
			// TODO: Slack doesn't provide data on if email is verified.
			EmailVerified: true,
			// TODO: 
			// CustomClaims: map[string]interface{}{
			// 	"https://slack.com/team_id": u.TeamID,
			// },
			// To be deprecated
			AvatarURL:  u.AvatarURL,
			FullName:   u.Name,
			// TODO: u.Sub is email
			ProviderId: u.Iss,
			// TODO
			Phone: u.Phone,
			PhoneVerified: u.PhoneVerified,
		},
		Emails: []Email{{
			Email:    u.Sub,
			// TODO: Slack doesn't provide data on if email is verified.
			Verified: true,
			Primary:  true,
		}},
	}, nil
}
