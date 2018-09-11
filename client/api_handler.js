// path is the relative path of the route
// verb is the method type
// {query, body, params} are the given payload to send
// {prefix} are api options (prefix is the api prefix, e.g: '/api') 
export default (path, verb, {query, body}, {prefix},{$axios}) => {
    return $axios({
        baseURL: `${document?document.location.origin:"http://"+process.env.HOST+":"+process.env.PORT}${prefix || ''}`,
        timeout: 10000,
        url: path,
        method: verb.toLowerCase(),
        data: body,
        params: query
    }).then(({data}) => data);
};