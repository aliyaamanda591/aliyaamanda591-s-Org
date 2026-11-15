/** Accept only HTTPS Google avatar hosts, without credentials or custom ports.
 * @param {unknown} value
 * @returns {string}
 */
export function safeGooglePhoto(value){
 if(typeof value!=='string'||value.length>2048)return '';
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&/^lh\d+\.googleusercontent\.com$/.test(url.hostname)?url.href:'';}catch{return '';}
}
