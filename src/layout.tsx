import 'sober/drawer'
import 'sober/appbar'
import 'sober/icon-button'
import 'sober/icon'
import 'sober/scroll-view'
import { Drawer } from 'sober/drawer'
import 'sober/menu'
import 'sober/navigation'
import 'sober/picker'
import 'sober/linear-progress'
import 'sober/search'
import { ParentProps, Show} from 'solid-js'
import { useLocation, useNavigate } from '@solidjs/router'
import { useAppContext } from './app_context'

function Layout (props: ParentProps) {
    const location = useLocation()
    const navigate = useNavigate();
    const [state,setState] = useAppContext()
    var searchContent = "";
    return (
        <>
        {/* 路由切换时显示加载进度条 */}
        <Show when={state.loading}>
            <s-linear-progress indeterminate={true} style={{position:"absolute","z-index":1,width:"100%"}}></s-linear-progress>
        </Show>

        <s-drawer style={{height:"100dvh",width:"100vw"}} ref={el => ( setState("drawerRef",el as Drawer))}>
        {/* 侧边导航 */}
            <s-navigation slot='start' mode="rail" style={{"border-right":"1px solid #e0e0e0", "width":"80px"}}>
                <s-navigation-item selected={location.pathname == "/"} onclick={() => {navigate("/")}}>
                    <s-icon name="home" slot="icon"></s-icon>
                    <div slot="text">首页</div>
                </s-navigation-item>
                <s-navigation-item selected={location.pathname.startsWith("/article")} onclick={() => {navigate("/articles")}}>
                    <s-icon slot="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"></path>
                    </svg>
                    </s-icon>
                    <div slot="text">文章</div>
                </s-navigation-item>
            </s-navigation>
        {/* 顶部导航 */}
            <s-appbar>
                <s-icon-button slot="navigation" onclick={() => state.drawerRef?.toggle()}>
                    <s-icon name="menu"></s-icon>
                </s-icon-button>
                    <div slot="logo" style={{"width":"35px","height":"35"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="35px" height="35px" viewBox="0 0 48 48">
                        <path fill="#ffb74d" d="M43.566,23.895c-0.335-3.686-1.963-7.133-3.379-8.851c1.254-2.442,0.617-7.343,0.22-9.197	c-0.431-2.011-1.915-3.207-2.92-1.532c-0.745,1.241-3.639,3.818-5.092,5.073c-2.923-1.144-5.965-1.605-8.43-1.39	c-2.465-0.214-5.507,0.247-8.43,1.39c-1.453-1.255-4.348-3.832-5.092-5.073C9.436,2.64,7.952,3.837,7.521,5.847	c-0.397,1.854-1.034,6.755,0.22,9.197c-1.417,1.718-3.044,5.165-3.379,8.851C4.103,26.74,3.69,28.581,3.883,31.65	c0.676,10.755,19.322,6.826,20.081,6.662c0.758,0.164,19.405,4.093,20.081-6.662C44.237,28.581,43.824,26.74,43.566,23.895z"></path><path fill="#ffe0b2" d="M43.566,23.94c-4.507-0.718-9.103,0.912-12.867,2.969c-1.632-1.376-4.015-2.249-6.678-2.249	c-2.688,0-5.092,0.889-6.725,2.288c-3.777-2.075-8.4-3.73-12.935-3.008c-1.34,2.5-2.395,5.318-1.723,8.445	C4.362,40.414,17,43,23.964,43c7.079,0,19.462-2.586,21.326-10.615C46.012,29.271,44.906,26.44,43.566,23.94z"></path><ellipse cx="9.358" cy="28.825" fill="#ff8a65" rx="2.705" ry="4.244" transform="rotate(-84.906 9.358 28.824)"></ellipse><path fill="#263238" d="M17.479,23.672c-0.083,0-0.167-0.01-0.25-0.032c-0.972-0.251-2.764-0.648-3.526-0.705	c-0.551-0.041-0.964-0.521-0.923-1.071s0.519-0.971,1.071-0.923c1.062,0.079,3.16,0.577,3.878,0.763	c0.535,0.138,0.856,0.684,0.718,1.218C18.331,23.372,17.924,23.672,17.479,23.672z"></path><ellipse cx="17.415" cy="17.519" fill="#ffe0b2" rx="1.628" ry="1.31"></ellipse><path fill="#ffe0b2" d="M9.021,6.039c0,0-0.957,5.298,0.447,7.851c1.787-2.106,3-2.745,3-2.745S10.489,7.507,9.021,6.039z"></path><path fill="#263238" d="M25.481,25.66c-0.567-0.116-1.112-0.16-1.443-0.161v0c-0.002,0-0.005,0-0.006,0s-0.005,0-0.006,0v0	c-0.331,0.001-0.876,0.044-1.443,0.161c-0.958,0.197-1.232,1.425-0.445,2.006c0.876,0.646,1.82,1.076,1.888,1.107v0.006	c0,0,0.006-0.003,0.006-0.003c0.001,0,0.006,0.003,0.006,0.003v-0.006c0.068-0.03,1.013-0.461,1.888-1.107	C26.712,27.085,26.439,25.856,25.481,25.66z"></path><path fill="#263238" d="M30.664,28.488c-0.115-0.251-0.41-0.359-0.663-0.247c-0.251,0.115-0.362,0.411-0.248,0.663	c0.203,0.443,0.155,0.872-0.135,1.207c-0.329,0.381-1.042,0.681-2.064,0.387c-1.953-0.565-3.313-1.083-3.327-1.088	c-0.066-0.025-0.134-0.035-0.2-0.032c-0.066-0.003-0.134,0.007-0.199,0.032c-0.014,0.005-1.344,0.525-3.297,1.09	c-1.023,0.294-1.736-0.006-2.064-0.387c-0.29-0.335-0.337-0.764-0.135-1.207c0.114-0.252,0.004-0.548-0.248-0.663	c-0.252-0.112-0.548-0.004-0.663,0.247c-0.363,0.796-0.255,1.647,0.288,2.276c0.194,0.225,0.437,0.394,0.704,0.532l2.623,3.145	c0,0,1.538-2.881,0.593-3.228c1.215-0.375,2.073-0.689,2.4-0.813c0.331,0.123,1.193,0.432,2.398,0.802	c-1.051,0.261,0.536,3.239,0.536,3.239l2.555-3.063c0.332-0.143,0.625-0.347,0.856-0.616C30.92,30.135,31.027,29.284,30.664,28.488z"></path><ellipse cx="38.643" cy="28.825" fill="#ff8a65" rx="4.244" ry="2.705" transform="rotate(-5.094 38.627 28.814)"></ellipse><path fill="#263238" d="M30.522,23.672c-0.445,0-0.852-0.299-0.968-0.75c-0.138-0.535,0.184-1.08,0.718-1.218	c0.718-0.186,2.815-0.684,3.878-0.763c0.554-0.048,1.03,0.372,1.071,0.923s-0.372,1.031-0.923,1.071	c-0.762,0.057-2.555,0.454-3.526,0.705C30.689,23.661,30.605,23.672,30.522,23.672z"></path><ellipse cx="30.587" cy="17.519" fill="#ffe0b2" rx="1.628" ry="1.31"></ellipse><path fill="#ffab91" d="M27.248,31.395c-1.237-0.235-3.14-0.973-3.211-1V30.39c0,0-0.006,0.002-0.006,0.002	c0,0-0.006-0.002-0.006-0.002v0.005c-0.07,0.027-1.973,0.765-3.211,1c-1.099,5.1,3.072,5.154,3.211,5.154v0c0,0,0.006,0,0.006,0	s0.006,0,0.006,0v0C24.176,36.549,28.346,36.496,27.248,31.395z"></path><path fill="#ffe0b2" d="M38.98,6.039c0,0,0.957,5.298-0.447,7.851c-1.787-2.106-3-2.745-3-2.745S37.512,7.507,38.98,6.039z"></path><path fill="#ff8a65" d="M24.037,30.395V30.39c0,0-0.006,0.002-0.006,0.002c0,0-0.006-0.002-0.006-0.002v0.005	c-0.02,0.008-0.199,0.077-0.465,0.173l0.406,4.29l0.589-4.27C24.256,30.479,24.059,30.403,24.037,30.395z"></path>
                        </svg>
                    </div>
                <Show when={window.innerWidth>768}>
                    <div slot="headline"> Qingzt's Blog </div>
                </Show>
                <s-search slot='search' placeholder="搜索关键字" onchange={(e) => {searchContent=((e.target as HTMLInputElement).value)}}>
                    <s-icon name="search" slot="start"></s-icon>
                    <s-icon-button slot="end" onclick={() => {navigate("/articles?search=" + encodeURIComponent(searchContent))}}>
                        <s-icon name="arrow_forward"></s-icon>
                    </s-icon-button>
                </s-search>
                <s-icon-button slot="action" onclick={() => {
                    const page = document.querySelector('s-page');
                    if (!page) {
                        return
                    }
                    if (page.theme === 'dark') {
                        page.theme = 'light'
                    } else {
                        page.theme = 'dark'
                    }
                }}>
                    <s-icon name="light_mode"></s-icon>
                </s-icon-button>
            </s-appbar>
        {/* 主体内容 */}
            <div style="width:100%;height:100%;overflow:auto">
                {props.children}
            </div>
            <Show when={location.pathname != "/"}>
            <s-scroll-view slot="end">
                <style>
                {`
                    #toc .cataloglistClass {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        line-height: 1.6;
                    }

                    /* 目录项样式 */
                    #toc .cataloglistClass li {
                        margin: 6px 0;
                        padding-left: 1rem;
                        position: relative;
                        transition: all 0.2s ease;
                    }

                    /* 层级缩进效果 */
                    #toc .cataloglistClass ul {
                        margin-left: 1rem;
                        border-left: 1px solid var(--s-color-tertiary);
                    }

                    /* 链接基础样式 */
                    #toc .cataloglinkClass {
                        color: var(--s-color-secondary);
                        text-decoration: none;
                        display: block;
                        padding: 4px 8px;
                        border-radius: 4px;
                        transition: all 0.2s ease;
                        font-size: 0.95em;
                    }

                    /* 悬停效果 */
                    #toc .cataloglinkClass:hover {
                        background: var(--s-color-secondary-container);
                        color: var(--s-color-secondary);
                        transform: translateX(4px);
                    }
                `}
                </style>
                {state.toc}
            </s-scroll-view>
            </Show>
        </s-drawer>
        </>
    )
}

export default Layout