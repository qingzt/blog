export interface Response {
    code : number;
    data : any;
    msg : string;
}

export interface ArticleListData {
    articles: Article[];
    label: Label | null;
    page_num: number;
}

export interface Label {
    id: string;
    name: string;
    color: string;
}

export interface Article {
    id: string;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
    labels: Label[];
}