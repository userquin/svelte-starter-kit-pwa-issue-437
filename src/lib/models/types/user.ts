/** Generated with https://app.quicktype.io/ **/

export interface User {
	github?: GithubUser;
	azure?: AzureADUser
}


export interface GithubUser {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                string;
    site_admin:          boolean;
    name:                string;
    company:             null;
    blog:                string;
    location:            string;
    email:               string;
    hireable:            boolean;
    bio:                 null;
    twitter_username:    string;
    public_repos:        number;
    public_gists:        number;
    followers:           number;
    following:           number;
    created_at:          Date;
    updated_at:          Date;
}

export interface AzureADUser {
	sub: string;
	name: string;
	family_name: string;
	given_name: string;
	picture: string;
	avatar_url: string;
}
