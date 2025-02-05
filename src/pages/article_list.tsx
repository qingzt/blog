import { createEffect, createMemo, createResource, For, onMount, Show } from "solid-js";
import 'sober/scroll-view'
import 'sober/card'
import dayjs from "dayjs";
import 'sober/button'
import 'sober/circular-progress'
import { useLocation, useNavigate, useSearchParams} from "@solidjs/router";
import { Article, ArticleListData, Label, Response } from "../types";
import { useAppContext } from "../app_context";
import { Title } from "@solidjs/meta";

function Labels(props: {labels: Label[]}) {
    return (
        <>
        <h2 style={{color:"var(--s-color-secondary)",padding:"4px 15px"}}>所有标签</h2>
        <nav id="toc" class="toc">
            <ul class="cataloglistClass">
                <For each={props.labels}>
                    {(label: Label) => (
                        <li>
                            <a class="cataloglinkClass" href={"/articles?label_id="+label.id}>{label.name}({label.count})</a>
                        </li>
                    )}
                </For>
            </ul>
        </nav>
        </>
    )
}

function ArticleList() {
  const [state,setState] = useAppContext();
  const [searchParams,setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const loaction = useLocation();
  const search = createMemo(()=>loaction.search);

  const fetchArticleListData = async (params: typeof search) => {
    const resp = await fetch("/api/articles"+params);
    const respjson = await resp.json() as Response;
    return respjson.data as ArticleListData; 
  }
  const [articleListData] = createResource(search, fetchArticleListData);

  const page = createMemo(()=> searchParams.page ? Number(searchParams.page) : 1);

  const about = createMemo(()=>{
    var aboutStr = "";
    const searchParams = new URLSearchParams(loaction.search);
    aboutStr = searchParams.get("search") || "";
    if (articleListData.latest?.label != null) {
      if (aboutStr != "") {
        aboutStr += "和";
      }
      aboutStr += articleListData.latest.label.name;
    }
    return aboutStr;
  });

  onMount(async ()=>{
    const resp = await(await fetch("/api/labels")).json() as Response;
    const labels = resp.data as Label[];
    setState("toc",<Labels labels={labels}></Labels>);
  })

  createEffect(()=>{
    setState("loading",articleListData.loading);
  })

  return (
    <div style={{position:"relative",height:"100%",width:"100%"}}>
      <s-fab style={{position:"absolute", right:"20px", bottom:"20px"}} onclick={() => {state.drawerRef?.toggle("end")}}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M840-480 666-234q-11 16-28.5 25t-37.5 9H200q-33 0-56.5-23.5T120-280v-400q0-33 23.5-56.5T200-760h400q20 0 37.5 9t28.5 25l174 246Zm-98 0L600-680H200v400h400l142-200Zm-542 0v200-400 200Z"></path>
      </svg>
      </s-fab>
    <s-scroll-view style={{height:"100%",width:"100%",display:"flex","flex-direction":"column","align-items":"center","justify-content":"start","gap":"30px","padding-top":"10px","box-sizing":"border-box"}} >
      <Title>Qingzt's Blog</Title>
      <Show when={about()!=""}>
        <h1>关于"{about()}"的结果</h1>
      </Show>
      <For each={articleListData.latest?.articles}>
        {(article: Article) => (
            <s-card onclick={()=>navigate("/article/"+article.id)} clickable={true} type="outlined" style={{width:"80%","max-width":"800px","min-width":"380px","height":"180px"}} >
              <h2 slot="headline" style={{"word-break":"break-all","display":"-webkit-box","-webkit-line-clamp":1,"-webkit-box-orient":"vertical","overflow":"hidden"}}>{article.title}</h2>
              <div slot="subhead" style={{"gap":"5px","display":"flex","flex-direction":"row","overflow-x":"auto","align-items":"center","white-space":"nowrap"}}>
                <small
                    style={{
                      "border-radius": "4px",
                      "background-color": "var(--s-color-primary-container)",
                      padding: "4px 6px",
                      color: "var(--s-color-primary)",
                    }}
                  >
                    发布于 {dayjs(article.created_at).format("YY-MM-DD HH:mm")}
                  </small>
                  <Show when={article.updated_at !== article.created_at}>
                    <small
                      style={{
                        "border-radius": "4px",
                        "background-color": "var(--s-color-secondary-container)",
                        padding: "4px 6px",
                        color: "var(--s-color-secondary)",
                      }}
                    >
                      更新于 {dayjs(article.updated_at).format("YY-MM-DD HH:mm")}
                    </small>
                  </Show>
                  <For each={article.labels}>
                    {(label: Label) => (
                      <s-button
                        onclick={(event)=>{event.stopPropagation();setSearchParams({label_id:label.id});}}
                        style={{
                          "background-color": `#${label.color}`,
                          color: "white",
                          "border-radius": "12px",
                          padding: "4px 10px",
                          height: "20px",
                          "box-sizing":"content-box",
                        }}
                      >
                        {label.name}
                      </s-button>
                    )}
                  </For>
              </div>
              <div slot="text" style={{"word-break":"break-all","display":"-webkit-box","-webkit-line-clamp":3,"-webkit-box-orient":"vertical","overflow":"hidden"}}>{article.body}</div>
            </s-card>
          )}
      </For>
      <div style={{display:"flex","flex-direction":"row","align-items":"center","justify-content":"center","gap":"10px"}}>
        <Show when={articleListData.latest && articleListData.latest.page_num > 1}>
          <s-button onclick={()=>{
            setSearchParams({page:page()-1});
          }}>上一页</s-button>
        </Show>
        <Show when={articleListData.latest && page() < articleListData.latest?.page_num}>
          <s-button onclick={()=>{
            setSearchParams({page:page()+1});
          }}>下一页</s-button>
        </Show>
      </div>
    </s-scroll-view>
    </div>
  );
}

export default ArticleList;