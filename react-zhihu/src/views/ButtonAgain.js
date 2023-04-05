import { Button } from 'antd-mobile';
import { useState } from 'react';


function ButtonAgain(props) {
    /* props中包含了调用<Button>组件时候的属性 */
    let options = { ...props };
    let { children, onClick: handle } = options;
    delete options.children;

    /* 状态 */
    let [loading, setLoading] = useState(false);
    const clickHandle = async () => {
        setLoading(true);
        try {
            await handle();
        } catch (_) { }
        setLoading(false);
    };
    // 如果有onClick，调用clickHandle方法，防止button不传onClick
    if (handle) {
        options.onClick = clickHandle;
    }

    return (
        <Button {...options} loading={loading}>
            {children}
        </Button>
    )

}

export default ButtonAgain