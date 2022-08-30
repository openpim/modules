const ldap = require('ldapjs')

const LDAP_URL = 'ldap://127.0.0.1:389'
const USER_FULL_ID = ',OU=PIM,OU=ServicesServers,DC=domain,DC=com'
const PIM_GROUP = 'PIM-Access'
const DEFAULT_GROUPS = ['base']

const auth = (login, password) => { 
    return new Promise((resolve, reject) => {
        const client = ldap.createClient({
            url: [LDAP_URL]
        })

        client.on('error', (err) => {
            reject(err)
        })

        client.bind(login, password, (err) => {
            if (err) {
                reject(err)
            } else {
                const user = 'CN='+login+USER_FULL_ID
                client.search(user, { // notice, full id of user profile here
                    scope: 'base', // important
                }, function (error, res) {
                    if (error) {
                        reject(error)
                    }
                    res.on('searchEntry', function (data) {
                        if (data.object.memberOf && data.object.memberOf.includes(PIM_GROUP)){
                            resolve({login: login, tenantId: 'default' , name: data.object.displayName, email: data.object.userPrincipalName, groups:DEFAULT_GROUPS})
                        } else {
                            reject('User does not have group '+ PIM_GROUP)
                        }
                    })
                    res.once('error', function (error) {
                        reject(error)
                    })
                    res.once('end', function () {
                    })
                })
            }
        })
    })
}
export default auth
