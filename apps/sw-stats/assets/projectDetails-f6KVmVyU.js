import{H as e,_ as t,d as n,f as r,g as i,h as a,m as o,p as s,r as c,s as l,u,xt as d,y as f}from"./aggregate-BoSeT91H.js";var p=6048e5;function m(e){if(!e.size)return[];let t=[...e.keys()].sort()[0],n=_(new Date),r=[];for(let i=Date.parse(`${t}T12:00:00Z`);;i+=p){let t=new Date(i).toISOString().slice(0,10);if(t>n)break;r.push({start:t,...e.get(t)??{mine:0,others:0}})}return r}function h(e,t,n,r=1){let i=e.get(t)??{mine:0,others:0};i[n?`mine`:`others`]+=r,e.set(t,i)}function g(e){return{mine:e.reduce((e,t)=>e+(t.isMe?t.commits:0),0),all:e.reduce((e,t)=>e+t.commits,0)}}function _(e){let t=new Date(e);return t.setHours(0,0,0,0),t.setDate(t.getDate()-t.getDay()),c(t)}var v=`query($owner: String!, $name: String!, $branch: String!, $after: String) {
  repository(owner: $owner, name: $name) {
    ref(qualifiedName: $branch) {
      target {
        ... on Commit {
          oid
          history(first: 100, after: $after) {
            totalCount
            pageInfo { hasNextPage endCursor }
            nodes { committedDate author { name user { login avatarUrl url } } }
          }
        }
      }
    }
  }
}`,y=`query($owner: String!, $name: String!, $branch: String!, $uid: ID!, $after: String) {
  repository(owner: $owner, name: $name) {
    ref(qualifiedName: $branch) {
      target {
        ... on Commit {
          oid
          history(first: 100, after: $after, author: { id: $uid }) {
            totalCount
            pageInfo { hasNextPage endCursor }
            nodes { additions deletions }
          }
        }
      }
    }
  }
}`,b=100;async function x(e,n,r,i){let a=[],{graphql:o}=t(e,a),[s,c]=r.fullName.split(`/`),u=e=>JSON.stringify(e),d=`repo:${r.fullName}`,p=o(`query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        defaultBranchRef { name }
        licenseInfo { name spdxId }
        repositoryTopics(first: 20) { nodes { topic { name } } }
        homepageUrl diskUsage
        releases { totalCount }
        refs(refPrefix: "refs/heads/", first: 0) { totalCount }
        issuesOpen: issues(states: OPEN) { totalCount }
        issuesClosed: issues(states: CLOSED) { totalCount }
        prOpen: pullRequests(states: OPEN) { totalCount }
        prMerged: pullRequests(states: MERGED) { totalCount }
        prClosed: pullRequests(states: CLOSED) { totalCount }
      }
      myOpen: search(type: ISSUE, first: 0, query: ${u(`${d} is:pr author:${n} is:open`)}) { issueCount }
      myMerged: search(type: ISSUE, first: 0, query: ${u(`${d} is:pr author:${n} is:merged`)}) { issueCount }
      myClosed: search(type: ISSUE, first: 0, query: ${u(`${d} is:pr author:${n} is:closed is:unmerged`)}) { issueCount }
      reviewed: search(type: ISSUE, first: 0, query: ${u(`${d} is:pr reviewed-by:${n} -author:${n}`)}) { issueCount }
    }`,{owner:s,name:c});async function x(e,t,n={}){let r={owner:s,name:c,branch:`refs/heads/${t}`,...n},i=async t=>(await o(e,{...r,after:t})).repository?.ref?.target??null,u=await i(null);if(!u)return null;let{totalCount:d}=u.history,p=Math.min(Math.ceil(d/100),b);d>1e4&&a.push(`The commit history is capped at the latest ${l(1e4)} commits.`);let m=Array.from({length:p-1},(e,t)=>(t+1)*100-1);return[u,...await f(m,6,e=>i(`${u.oid} ${e}`))].flatMap(e=>e?.history.nodes??[])}let S=(e,t)=>t().catch(t=>(a.push(`${e}: ${t.message}`),null)),[C,w,T]=await Promise.all([p,i?S(`Commit history`,()=>x(v,i)):null,i?S(`Lines you changed`,async()=>{let{viewer:e}=await o(`{ viewer { id } }`);return x(y,i,{uid:e.id})}):null]),E=C.repository,D=n.toLowerCase(),O=new Map,k=null,A=T?.length?{added:T.reduce((e,t)=>e+t.additions,0),deleted:T.reduce((e,t)=>e+t.deletions,0)}:null;if(w){let e=new Map;for(let t of w){let n=t.author?.user,r=n?.login??t.author?.name??`Unknown`;if(!n&&/\[bot\]$/i.test(r))continue;let i=n?.login.toLowerCase()===D;h(e,_(new Date(t.committedDate)),i);let a=n?`github:${n.login.toLowerCase()}`:`name:${r.trim().toLowerCase()}`,o=O.get(a)??{key:a,name:r,avatarUrl:n?.avatarUrl??null,url:n?.url??null,commits:0,isMe:i};o.commits++,O.set(a,o)}k=m(e)}return{projectId:r.id,fetchedAt:new Date().toISOString(),defaultBranch:E.defaultBranchRef?.name??null,license:E.licenseInfo?E.licenseInfo.spdxId??E.licenseInfo.name:null,topics:E.repositoryTopics.nodes.map(e=>e.topic.name),homepage:E.homepageUrl||null,sizeBytes:E.diskUsage==null?null:E.diskUsage*1024,releases:E.releases.totalCount,branches:E.refs?.totalCount??null,branch:i,commits:w?g([...O.values()]):null,contributors:[...O.values()].sort((e,t)=>t.commits-e.commits),weeks:k,myLines:A,requests:{open:E.prOpen.totalCount,merged:E.prMerged.totalCount,closed:E.prClosed.totalCount},myRequests:{open:C.myOpen.issueCount,merged:C.myMerged.issueCount,closed:C.myClosed.issueCount},reviewedByMe:C.reviewed.issueCount,issues:{open:E.issuesOpen.totalCount,closed:E.issuesClosed.totalCount},warnings:a}}async function S(e,t,n){let r=[],{getJson:o,getAll:s,total:c}=i(e.baseUrl,e.token),l=t.id.replace(/^gitlab:/,``),u=await o(`/user`),d=a(u,e.identities),f=`/projects/${l}/merge_requests`,p=async(e,t,n)=>{try{return await t()}catch(t){return r.push(`${e}: ${t.message}`),n}},v={open:0,merged:0,closed:0},[y,b,x,S,C,w,T,E,D]=await Promise.all([o(`/projects/${l}?statistics=true&license=true`),p(`Contributors`,()=>s(`/projects/${l}/repository/contributors?order_by=commits&sort=desc`,5),[]),p(`Commits`,()=>s(`/projects/${l}/repository/commits${n?`?ref_name=${encodeURIComponent(n)}`:``}`,100),null),p(`Merge requests`,async()=>({open:await c(`${f}?state=opened`),merged:await c(`${f}?state=merged`),closed:await c(`${f}?state=closed`)}),v),p(`Your merge requests`,async()=>({open:await c(`${f}?state=opened&author_id=${u.id}`),merged:await c(`${f}?state=merged&author_id=${u.id}`),closed:await c(`${f}?state=closed&author_id=${u.id}`)}),v),p(`Reviews`,()=>c(`${f}?reviewer_id=${u.id}`),0),p(`Issues`,async()=>{let e=await o(`/projects/${l}/issues_statistics`);return{open:e.statistics.counts.opened,closed:e.statistics.counts.closed}},{open:0,closed:0}),p(`Releases`,()=>c(`/projects/${l}/releases`),null),p(`Branches`,()=>c(`/projects/${l}/repository/branches`),null)]),O=new Map,k=(e,t,n)=>{let r=`gitlab:${e.trim().toLowerCase()}`,i=O.get(r)??{key:r,name:e,avatarUrl:null,url:null,commits:0,isMe:!1};i.commits+=t,i.isMe||=n,O.set(r,i)};if(x)for(let e of x)k(e.author_name,1,d({name:e.author_name,email:e.author_email}));else for(let e of b)k(e.name,e.commits,d(e));let A=null;if(x){let e=new Map;for(let t of x)h(e,_(new Date(t.created_at)),d({name:t.author_name,email:t.author_email}));A=m(e),x.length>=1e4&&r.push(`The commit history is capped at the latest 10,000 commits.`)}return{projectId:t.id,fetchedAt:new Date().toISOString(),defaultBranch:y.default_branch,branch:n??y.default_branch,commits:x?g([...O.values()]):null,license:y.license?y.license.nickname??y.license.name:null,topics:y.topics??y.tag_list??[],homepage:null,sizeBytes:y.statistics?.repository_size??null,releases:E,branches:D,contributors:[...O.values()].sort((e,t)=>t.commits-e.commits),weeks:A,myLines:null,requests:S,myRequests:C,reviewedByMe:w,issues:T,warnings:r}}var C=`https://archive.softwareheritage.org/api/1`,w=`https://archive.softwareheritage.org/save/`;async function T(e){let t=new Date().toISOString();if(e.visibility!==`public`)return{state:`private`,checkedAt:t};let n=e.url.replace(/\/+$/,``);for(let e of[n,`${n}.git`]){let n;try{n=await fetch(`${C}/origin/${e}/visit/latest/?require_snapshot=true`)}catch{throw Error(`Could not reach the Software Heritage archive.`)}if(n.status===404)continue;if(n.status===429)throw Error(`Software Heritage rate limit reached; try again later.`);if(!n.ok)throw Error(`Software Heritage answered ${n.status} ${n.statusText}.`);let r=await n.json();return{state:`archived`,originUrl:e,lastVisit:r.date,visitStatus:r.status,swhid:`swh:1:snp:${r.snapshot}`,browseUrl:`https://archive.softwareheritage.org/browse/origin/directory/?origin_url=${encodeURIComponent(e)}`,checkedAt:t}}return{state:`not-archived`,checkedAt:t}}function E(e){return e.statsBranch===`develop`&&e.defaultBranch!==`develop`}function D(e,t){return t===`develop`&&E(e)?`develop`:e.defaultBranch??e.statsBranch}var O=(e,t)=>`${e.id}@${t??``}`,k=`sw-stats:project-details-4`,A=[`sw-stats:project-details`,`sw-stats:project-details-2`,`sw-stats:project-details-3`],j=`sw-stats:archive-status`,M=e(`projectDetails`,()=>{A.forEach(s);let e=d(r(k,{})),t=d({}),i=d({}),a=d(r(j,{})),c=d({}),l=d({});async function f(e,{force:t=!1}={}){if(!(c.value[e.id]||!t&&a.value[e.id])){c.value={...c.value,[e.id]:!0},l.value={...l.value,[e.id]:``};try{a.value={...a.value,[e.id]:await T(e)},o(j,a.value)}catch(t){l.value={...l.value,[e.id]:t.message}}finally{c.value={...c.value,[e.id]:!1}}}}async function p(r,a,{force:s=!1}={}){let c=O(r,a);if(t.value[c]||!s&&e.value[c])return;let{settings:l}=n(),d=u();t.value={...t.value,[c]:!0},i.value={...i.value,[c]:``};try{let t=r.source===`github`?await x(l.githubToken.trim(),d.data.github?.user.login??``,r,a):await S({baseUrl:l.gitlabUrl.trim(),token:l.gitlabToken.trim(),identities:l.gitlabIdentities.split(/[,\n]/).map(e=>e.trim()).filter(Boolean)},r,a);e.value={...e.value,[c]:t},o(k,e.value)}catch(e){i.value={...i.value,[c]:e.message}}finally{t.value={...t.value,[c]:!1}}}function m(){e.value={},a.value={},s(k),s(j)}return{details:e,loading:t,errors:i,fetchDetail:p,archives:a,archiveLoading:c,archiveErrors:l,fetchArchive:f,clear:m}});export{w as a,E as i,O as n,D as r,M as t};