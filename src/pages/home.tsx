import 'sober/drawer'
import 'sober/appbar'
import 'sober/icon-button'
import 'sober/icon'
import 'sober/scroll-view'
import 'sober/menu'
import 'sober/navigation'
import 'sober/picker'
import { Title } from '@solidjs/meta'
import { createResource } from 'solid-js'

function Home () {
    const [backgroundUrl] = createResource(async () => {
        const resp = await fetch('/bing-images')
        const data = await resp.json()
        return data["MediaContents"][0]["ImageContent"]["Image"]["Url"]
    })
    return (
        <div style={{position:"relative", display: 'flex', "flex-direction": 'column', "align-items": 'center', "justify-content": 'center', height: '100%', width: '100%', "z-index": '0', color: 'white'}}>
            <Title>Qingzt's Home</Title>
            <img src={backgroundUrl()} style={{position:'absolute', width:"100%", height:"100%", "filter": 'blur(3px)',"object-fit":"cover","z-index":"-1"}} />
            <div style={{position:'absolute', width:"100%", height:"100%", "background-color": 'rgba(0, 0, 0, 0.3)', "z-index":"-1"}} />
            <h1>
                Welcome to Qingzt's Blog
            </h1>
            <div style={{position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', "flex-direction": 'column', "align-items": 'center', gap: '8px', "z-index": 1}}>
                <div style={{ display: 'flex', gap: '24px', "flex-wrap": 'wrap', "justify-content": 'center' }}>
                <style>
                {`
                a {
                    color: rgba(255,255,255,0.8);
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                `}
                </style>
                <a href="https://gh-proxy.qingzt.us.kg/https://github.com/moonlight-stream/moonlight-qt/releases/download/v6.1.0/MoonlightPortable-x64-6.1.0.zip">Moonloght</a>
                <a href="https://gfiber.speedtestcustom.com/">Speedtest</a>
            </div>
            </div>  
        </div>
    )
}

export default Home