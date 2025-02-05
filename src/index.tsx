/* @refresh reload */
import { render } from 'solid-js/web'
import { MetaProvider } from '@solidjs/meta'
import { Router,Route } from "@solidjs/router";
import 'sober/page'
import Home from './pages/home.tsx'
import ArticleList from './pages/article_list.tsx';
import Layout from './layout.tsx';
import Article from './pages/article.tsx';
import { AppContextProvider } from './app_context.tsx';


const root = document.getElementById('root')

render(() => (
    <MetaProvider>
    <AppContextProvider>
        <Router root={Layout}>
            <Route path="/" component={Home} />
            <Route path="/articles" component={ArticleList} />
            <Route path="/article/:id" component={Article} />
            <Route path="*404" component={()=><h1>404 NOT FOUND</h1>} />
        </Router>
    </AppContextProvider>
    </MetaProvider>
), root!)
