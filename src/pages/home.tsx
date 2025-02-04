import 'sober/drawer'
import 'sober/appbar'
import 'sober/icon-button'
import 'sober/icon'
import 'sober/scroll-view'
import 'sober/menu'
import 'sober/navigation'
import 'sober/picker'
import { Title } from '@solidjs/meta'
import { onMount } from 'solid-js'
import { useAppContext } from '../app_context'

function Home () {
    const [state,_] = useAppContext()
    onMount(() => {
        state.drawerRef?.close("end");
    })
    return (
        <div>
            <Title>Qingzt's Home</Title>
            <h1>Home</h1>
        </div>
    )
}

export default Home