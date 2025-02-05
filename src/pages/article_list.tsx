import { createEffect, createSignal, For, Show } from "solid-js";
import 'sober/scroll-view'
import 'sober/card'
import { createStore, reconcile } from "solid-js/store";
import dayjs from "dayjs";
import 'sober/button'
import 'sober/circular-progress'
import { useLocation, useNavigate} from "@solidjs/router";
import { Response, Label, Article, ArticleListData } from "../types";
import { useAppContext } from "../app_context";
import { Title } from "@solidjs/meta";

function ArticleList() {
  const [articles, setArticles] = createStore([] as Article[]);
  const [pageNum, setPageNum] = createSignal(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [about, setAbout] = createSignal("");
  let searchParams = new URLSearchParams(location.search);
  var page = 1;
  const [_,setState] = useAppContext();
  createEffect(async () => {
    searchParams = new URLSearchParams(location.search);
    page = Number(searchParams.get("page")) || 1;
    setState("loading",true);
    var aboutStr = "";
    if(searchParams.has("search")){
      aboutStr += searchParams.get("search")!;
    }
    var resp:Response = await (await fetch("/api/articles"+location.search)).json();
    if (resp.code === 0) {
      var data : ArticleListData = resp.data;
      setPageNum(data.page_num);
      setArticles(reconcile(data.articles));
      if(data.label!=null){
        aboutStr = aboutStr+" "+data.label.name;
        aboutStr = aboutStr.trim();
      }
    }
    setAbout(aboutStr);
    setState("loading",false);
  });
  return (
    <s-scroll-view style={{height:"100%",width:"100%",display:"flex","flex-direction":"column","align-items":"center","justify-content":"start","gap":"30px","padding-top":"10px","box-sizing":"border-box"}} >
      <Title>Qingzt's Blog</Title>
      <Show when={about()!=""}>
        <h1>关于"{about()}"的结果</h1>
      </Show>
      <For each={articles}>
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
                        onclick={(event)=>{event.stopPropagation();searchParams.set("label_id",label.id);navigate(location.pathname+"?"+searchParams.toString());}}
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
        <Show when={pageNum() > 1}>
          <s-button onclick={()=>{
            searchParams.set("page",String(page-1));
            navigate(searchParams.toString());
          }}>上一页</s-button>
        </Show>
        <Show when={page < pageNum()}>
          <s-button onclick={()=>{
            searchParams.set("page",String(page+1));
            navigate(searchParams.toString());
          }}>下一页</s-button>
        </Show>
      </div>
    </s-scroll-view>
  );
}

export default ArticleList;