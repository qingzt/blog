import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, For, onCleanup, onMount, Show } from "solid-js";
import { Article, Label } from "../types";
import { Meta, Title } from "@solidjs/meta";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import markdownItTocDoneRight from "markdown-it-toc-done-right";
import prism from "markdown-it-prism";
import "prismjs/components/prism-clike"
import "prismjs/components/prism-go"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-dart"
import { useAppContext } from "../app_context";
import 'sober/FAB'
import dayjs from "dayjs";
import Giscus from "@giscus/solid";

function TabelOfContents(props: {toc: string}) {
    return (
        <>
        <h2 style={{color:"var(--s-color-secondary)",padding:"4px 15px"}}>目录</h2>
        <div innerHTML={props.toc}></div>
        </>
    )
}

function ArticlePage() {
    const id = useParams().id;
    const [state,setState] = useAppContext();
    const navigate = useNavigate();
    const md = MarkdownIt({
        html: false,
        linkify: true,
        typographer: true,
        xhtmlOut: true,
        breaks:true,
    });
    md.use(prism,{});
    md.use(anchor,{
        permalinkBefore: true,
        permalink: anchor.permalink.ariaHidden({symbol: "§",placement: 'before'}),
        slugify:function (s: string) {
            return s.replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g,'').replace(/\s+/g,'').toLowerCase();
        },
    });
    md.use(markdownItTocDoneRight,{
        slugify: function (s: string) {
            return s.replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g,'').replace(/\s+/g,'').toLowerCase();
        },
        containerClass: 'toc',//生成的容器的类名，这样最后返回来的字符串是 <nav class="toc"><nav/>
        containerId: 'toc',//生成的容器的ID，这样最后返回来的字符串是 <nav id="toc"><nav/>
        listType: 'ul',//导航列表使用ul还是ol
        listClass: 'cataloglistClass',//li标签的样式名
        linkClass: 'cataloglinkClass',//a标签的样式名
        callback: function (html: string) {
            setState("toc",TabelOfContents({toc:html}));
        }
    });

    const [article] = createResource(id, async (id: string) => {
        const resp = await fetch("/api/article/" + id);
        const respjson = await resp.json();
        return respjson.data as Article;
    });

    onMount(async () => {
        if(window.innerWidth > 1024){
            state.drawerRef?.show("end");
        }
    });

    createEffect(() => {
        setState("loading", article.loading);
    });

    onCleanup(() => {
        setState("toc",<h2 style={{color:"var(--s-color-secondary)",padding:"4px 15px"}}>暂无目录或标签</h2>);
    });

    return (
        <div style={{position:"relative",height:"100%",width:"100%"}}>
            <s-fab style={{position:"absolute", right:"20px", bottom:"20px"}} onclick={() => {state.drawerRef?.toggle("end")}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"></path>
                </svg>
            </s-fab>
        <s-scroll-view style={{height:"100%",width:"100%",display:"flex","flex-direction":"column","align-items":"center","justify-content":"start"}}>
            <div style={{width:"100%",padding:"15px","box-sizing":"border-box"}}>
            <Title>{article.latest?.title}</Title>
            <Meta property="og:title" content={article.latest?.title} />
                <div slot="subhead" style={{"gap":"8px","display":"flex","flex-direction":"row","overflow-x":"auto","align-items":"center","white-space":"nowrap"}}>
                    <small
                        style={{
                            "border-radius": "4px",
                            "background-color": "var(--s-color-primary-container)",
                            padding: "4px 6px",
                            color: "var(--s-color-primary)",
                        }}>
                    发布于 {dayjs(article?.latest?.created_at).format("YY-MM-DD HH:mm")}
                    </small>
                    <Show when={article.latest?.updated_at !== article.latest?.created_at}>
                    <small
                        style={{
                        "border-radius": "4px",
                        "background-color": "var(--s-color-secondary-container)",
                        padding: "4px 6px",
                        color: "var(--s-color-secondary)",
                        }}
                    >
                        更新于 {dayjs(article.latest?.updated_at).format("YY-MM-DD HH:mm")}
                    </small>
                    </Show>
                    <For each={article.latest?.labels}>
                    {(label: Label) => (
                        <s-button
                        onclick={(event)=>{event.stopPropagation();navigate("/articles?label_id="+label.id)}}
                        style={{
                            "background-color": `#${label.color}`,
                            color: "white",
                            "border-radius": "12px",
                            padding: "4px 10px",
                            height: "15px",
                            "box-sizing":"content-box",
                        }}
                        >
                        {label.name}
                        </s-button>
                    )}
                    </For>
                </div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.css" integrity="sha512-Hasfm7Iv5AG2/v5DSRXetpC33VjyPBXn5giooMag2EgSbiJ2Xp4GGvYGKSvc68SiJIflF/WrbDFdNmtlZHE5HA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.css" rel="stylesheet" />
                <style>
                {`
                    .markdown-body {
                        box-sizing: border-box;
                        min-width: 200px;
                        max-width: 980px;
                        width: 100%;
                        margin: 0 auto;
                        padding: 45px;
                        background-color: var(--s-color-surface);
                        color: var(--s-color-on-surface);
                    }

                    @media (max-width: 767px) {
                        .markdown-body {
                            padding: 15px;
                        }
                    }
                `}
                </style>
                <article class="markdown-body" style={{"user-select": "text"}} innerHTML={"<h1>"+(article.latest?.title||"")+"</h1>"+md.render(article.latest?.body||'')}></article>
            </div>
            <Show when={article.latest}>
                    <div style={{width:"100%","min-width":"200px","max-width":"980px",padding:"15px","box-sizing":"border-box",display:"flex","flex-direction":"column","align-items":"center","justify-content":"start"}}>
                        <Giscus
                            id="comments"
                            repo="qingzt/blog"
                            repoId="R_kgDONw2X4A"
                            category="Announcements"
                            categoryId="DIC_kwDONw2X4M4Cmce1"
                            mapping="og:title"
                            reactionsEnabled="1"
                            emitMetadata="0"
                            inputPosition="top"
                            theme="light"
                            lang="en"
                            loading="lazy"
                        />
                    </div>
            </Show>
        </s-scroll-view>
        </div>
    );
}

export default ArticlePage;