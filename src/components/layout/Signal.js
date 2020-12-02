import React from 'react'

const Signal = (props) => {
    return (<div>
{navigator.onLine?(<i class="material-icons">signal_wifi_4_bar</i>):<i class="material-icons">signal_wifi_off</i>}
</div>
)
}
export default Signal