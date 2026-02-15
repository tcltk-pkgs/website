let packages = [];
let metrics = {};
let exploreTags = [];
let funFacts = [];

// const REGISTRY_URL = './packages.json';
const REGISTRY_URL = 'https://cdn.jsdelivr.net/gh/tcltk-pkgs/registry@master/metadata/packages-meta.json';

function getFossilIcon() {
    return `<svg class="method-icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor"
        style="vertical-align: middle; display: inline-block;"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M10.242,17.981,10.2,17.97l-.042-.022-.039-.028-.036-.036-.036-.045-.034-.05-.059-.126L9.9,17.508l-.042-.179-.034-.2L9.8,16.9l-.02-.509.02-.576.056-.632.1-.669.137-.663.159-.613.179-.548.193-.473.1-.2.1-.179.1-.151.1-.126.1-.1.05-.039.048-.028.048-.022.048-.014.048,0,.045,0,.045.011.042.022.039.028.039.036.034.045.034.05.062.126.05.154.042.179.034.2.025.224.02.509-.017.576-.059.632-.1.669-.134.663L11.4,16.1l-.179.548-.193.473-.1.2-.1.179-.1.154-.1.126-.1.1-.05.036-.048.031-.048.022-.048.011-.048.006Z"/>
        <path d="M11.361,23.548l-.042.006-.045,0-.045-.008-.045-.014-.048-.022-.045-.031L11,23.4l-.1-.1-.1-.12-.1-.145-.1-.165-.187-.383-.173-.448-.157-.5-.134-.546-.1-.554L9.8,19.911l-.022-.481L9.789,19l.02-.187.031-.171.039-.154.048-.129.056-.109.031-.045.031-.039.036-.031.036-.028.039-.02.042-.011.042-.006.045,0,.045.008.045.014.048.022.048.028.1.076.1.1.1.123.1.145.1.162.185.383.176.45.157.5.134.548.1.554.059.523.022.478-.014.428-.02.187-.031.171-.039.151-.048.131-.056.109-.031.045-.031.039-.036.031-.036.028-.039.02Z"/>
        <path d="M14.556,27.563l-.034.02-.036.017-.042.008-.042.006h-.048l-.05-.008L14.2,27.58l-.118-.045-.126-.064-.134-.084-.14-.1-.3-.243-.311-.3-.313-.355-.313-.4-.288-.42-.243-.406-.2-.389-.143-.355-.053-.165-.036-.151-.025-.14-.008-.126.008-.109.008-.048.014-.045.017-.042.022-.036.025-.031.031-.025.034-.02.039-.017.039-.008.045-.006h.045l.05.006.109.028.115.045.126.064.134.081.14.1.3.246.311.3.316.355.313.4.288.417.243.408.193.386.145.358.05.162.039.154.022.137.008.126-.008.112-.008.048-.014.045-.017.042-.022.036-.025.031Z"/>
        <path d="M19.967,28.657l-.008.034-.017.034-.022.031-.028.031-.036.028-.042.025-.1.048-.126.042-.148.036-.168.028-.185.022-.422.022-.481-.006L17.656,29l-.56-.067-.557-.1-.512-.115-.462-.129-.4-.143L15,28.372l-.151-.073-.131-.076-.109-.076-.084-.076-.031-.039L14.461,28l-.02-.036-.011-.036-.006-.036v-.034l.008-.034.017-.034.022-.031.028-.031.036-.028.042-.025.1-.048.126-.042.148-.036.165-.028.187-.022.422-.022.478.006.526.036.56.067.557.1.515.115.462.129.4.143.173.076.151.073.131.076.109.076.084.076.031.039.028.036.02.036.011.036.006.036Z"/>
        <path d="M20.185,28.45l-.008-.028v-.031l.006-.031.008-.034.017-.036.022-.036.062-.078.081-.084.1-.087.255-.19.322-.2.38-.2.428-.2.467-.2.476-.173.453-.143.417-.106.372-.073.316-.036.134,0,.118.006.1.017.039.011.036.017.031.017.025.02.02.022.014.025.008.028v.031l-.006.031-.008.034-.017.036-.022.036-.062.078-.081.084-.1.087-.255.19-.325.2-.378.2-.431.2-.467.2-.476.173-.45.143-.417.106-.372.073-.316.036-.134,0-.118-.006-.1-.017-.039-.011-.036-.017-.031-.017-.025-.02-.02-.022Z"/>
        <path d="M24.8,26.492l-.006-.006-.006-.006-.006-.014-.006-.02V26.4l0-.028.017-.059.025-.067.034-.078.1-.179.129-.2.159-.224.187-.241.21-.249.218-.241.213-.218.2-.187.185-.157.162-.118.073-.045.064-.034.056-.022.025-.008.022,0,.02,0,.02,0,.014.006.008,0,.006.006.006.006.006.006.006.014.006.02,0,.02,0,.022,0,.028-.014.059-.025.067-.034.078-.1.179-.129.2-.159.224-.187.241-.21.249-.218.241-.213.218-.2.187-.185.157-.162.118-.073.045-.064.034-.059.022-.025.008-.022,0-.02,0-.02,0-.014-.006-.008,0Z"/>
        <path d="M12.746,27.815v-.1l0-.1,0-.1-.006-.1-.006-.1-.008-.1-.011-.1-.008-.092-.014-.09-.011-.087-.014-.087-.017-.081-.017-.081-.017-.076-.02-.076-.022-.07-.02-.064-.022-.064-.022-.059-.025-.053-.022-.05-.025-.048-.028-.039-.025-.036-.028-.034-.028-.028L12.3,25.9l-.028-.017-.028-.011-.028-.008-.028,0h0l-.028,0-.028.008-.028.011-.028.017-.028.022-.028.028-.028.034-.025.036-.028.039-.025.048-.022.05-.025.053-.022.059-.022.064-.02.064-.022.07-.02.076-.017.076-.017.081-.017.081-.014.087-.011.087-.014.09-.008.092-.011.1-.008.1-.006.1-.006.1,0,.1,0,.1v.1h0v.1l0,.1,0,.1.006.1.006.1.008.1.011.1.008.092.014.09.011.087.014.087.017.081.017.081.017.076.02.076.022.07.02.064.022.064.022.059.025.053.022.05.025.048.028.039.025.036.028.034.028.028.028.022.028.017.028.011.028.008.028,0h0l.028,0,.028-.008.028-.011.028-.017.028-.022.028-.028.025-.034.025-.036.028-.039.025-.048.022-.05.025-.053.022-.059.022-.064.02-.064.022-.07.02-.076.017-.076.017-.081.017-.081.014-.087.011-.087.014-.09.008-.092.011-.1.008-.1.006-.1.006-.1,0-.1,0-.1Z"/>
        <path d="M11.971,29.913l-.017.022-.025.02-.025.017-.034.011-.034.008L11.795,30l-.09,0-.106-.011-.12-.022-.131-.034-.143-.045-.316-.126-.35-.165-.369-.2-.386-.238L9.411,28.9l-.336-.257-.294-.252-.241-.238-.1-.115-.084-.106-.07-.1-.05-.092L8.2,27.658l-.011-.039-.006-.036,0-.034,0-.034.008-.028.014-.025.02-.022.022-.02.028-.017.031-.011.036-.008.039-.006.092,0,.106.011.12.022.131.034.143.045.316.123.35.165.369.2.386.238.372.257.336.257.291.252.243.238.1.115.084.106.07.1.053.092.034.084.011.039.008.036v.034l0,.034-.008.028Z"/>
        <path d="M8.152,27.448l-.008.006-.008.006-.008.006-.011,0-.011,0H8.091l-.028,0-.034-.006-.036-.011-.039-.014-.042-.02-.09-.05-.1-.064-.1-.076-.1-.09-.1-.1L7.33,26.95l-.076-.09L7.2,26.777l-.022-.039-.02-.039-.014-.034-.011-.031L7.123,26.6v-.022l0-.011,0-.011.006-.008.006-.008.008-.006.008-.008.008,0,.011,0,.011,0h.042l.034.008.034.011.039.014.042.02.092.048.1.064.1.078.1.087.1.1.087.092.073.092.059.084.025.039.02.036.014.036.011.031,0,.028,0,.014,0,.011v.011l0,.011-.006.008Z"/>
        <path d="M26.964,23.929l-.006,0-.008-.006-.011-.011-.011-.017-.008-.017-.006-.022-.006-.025,0-.062,0-.073.008-.087.034-.2.059-.235.081-.263.1-.288.12-.3.134-.3.134-.271.134-.243.126-.2.118-.165.056-.067.05-.05.048-.039.02-.017.022-.011.017-.006.02-.006.017,0h.006l.008,0,.006,0,.008.006.011.011.008.017.008.017.006.022.006.025.006.062,0,.073-.008.087-.036.2-.059.235-.081.263-.1.288-.12.3-.131.3-.134.271-.134.243-.126.207-.118.162-.056.067-.05.05-.048.039-.02.017-.022.011-.017.006-.02.006-.017,0h-.006Z"/>
        <path d="M18.331,25.014v-.1l0-.1,0-.1-.006-.1-.006-.1-.008-.1-.008-.1-.011-.092-.011-.09-.014-.087-.014-.087L18.23,23.9l-.017-.081-.017-.076-.02-.076-.02-.07-.02-.064-.022-.064-.022-.059-.025-.053-.022-.05-.025-.048-.028-.039-.025-.036-.025-.034-.028-.028-.028-.022-.028-.017-.028-.011-.028-.008-.028,0h0l-.028,0-.028.008-.028.011-.028.017-.028.022-.028.028-.025.034-.025.036-.028.039L17.5,23.3l-.022.05-.025.053-.022.059-.022.064-.02.064-.02.07-.02.076-.017.076-.017.081-.017.081-.014.087-.014.087-.011.09-.011.092-.008.1-.008.1-.006.1-.006.1,0,.1,0,.1v.1h0v.1l0,.1,0,.1.006.1.006.1.008.1.008.1.011.092.011.09.014.087.014.087.017.081.017.081.017.076.02.076.02.07.02.064.022.064.022.059.025.053.022.05.025.048.028.039.025.036.025.034.028.028.028.022.028.017.028.011.028.008.028,0h0l.028,0,.028-.008.028-.011.028-.017.028-.022.028-.028.025-.034.025-.036.028-.039.025-.048.022-.05.025-.053.022-.059.022-.064.02-.064.02-.07.02-.076.017-.076.017-.081.017-.081.014-.087.014-.087.011-.09.011-.092.008-.1.008-.1.006-.1.006-.1,0-.1,0-.1Z"/>
        <path d="M17.572,27.113l-.017.022-.025.02-.025.017-.034.011-.034.008L17.4,27.2l-.09,0-.106-.011-.12-.022-.131-.034-.143-.045-.316-.126-.35-.165-.369-.2-.386-.238-.372-.255-.336-.257-.294-.252-.241-.238-.1-.115-.084-.106-.07-.1-.05-.092-.036-.084-.011-.039-.006-.036,0-.034,0-.034.008-.028.014-.025.02-.022.022-.02.028-.017.031-.011.036-.008.039-.006.092,0,.106.011.12.022.131.034.143.045.316.123.35.165.369.2.386.238.372.257.336.257.291.252.243.238.1.115.084.106.07.1.053.092.034.084.011.039.008.036v.034l0,.034-.008.028Z"/>
        <path d="M7.1,20.552l-.028-.028-.022-.031-.02-.034-.014-.036-.014-.042L7,20.339l-.006-.1.008-.1.02-.115.034-.123.045-.129.059-.134.067-.143.173-.291.213-.3.255-.3.277-.283.277-.241.274-.2.134-.081.129-.07.123-.059.118-.045.112-.031.1-.02.1,0,.045.006.042.008.039.011.034.017.034.02.031.022.028.028.022.031.02.034.014.039.014.039.008.045.006.092-.006.106-.022.115-.031.12-.045.131-.059.134-.07.14L9.439,19l-.215.3-.252.3-.277.283-.28.241-.274.2-.131.081-.131.07-.123.059-.118.045-.112.031-.1.017-.1,0-.045,0-.042-.008L7.2,20.611,7.167,20.6l-.034-.02Z"/>
        <path d="M6.614,20.42l-.028.006-.028,0-.031-.006L6.5,20.4l-.034-.017-.031-.022-.07-.062-.07-.078-.073-.1-.073-.115-.076-.129-.148-.3-.145-.358-.14-.4-.126-.436-.1-.439-.078-.417-.048-.38-.02-.339V16.66l.008-.134.014-.12.022-.1.031-.087.017-.036.02-.031.02-.025.025-.022.022-.014.028-.011L5.5,16.07l.028,0,.031.006.031.014.034.017.031.022.07.059.07.081.073.1.073.115.076.129.148.3.145.355.14.4.126.436.1.439.078.417.048.38.02.339v.151l-.008.134-.017.12-.022.1-.028.087-.017.036-.02.031-.022.025-.022.022-.025.014Z"/>
        <path d="M14.223,20.871l-.02-.022-.017-.022-.011-.028-.011-.034-.006-.034v-.036l.006-.084.017-.1.031-.1.045-.112.056-.12.143-.26.185-.283.221-.294.257-.3.274-.285.269-.249.263-.21.243-.168.115-.067.109-.056.1-.042.092-.028.084-.014h.073l.031.008.028.008.028.014.022.017.02.022.017.025.011.028.008.031.006.034,0,.039-.006.081-.02.1-.031.1-.042.112-.056.12-.143.26-.185.283-.224.294-.255.3-.274.285-.269.249-.263.213-.243.168-.115.067-.109.053-.1.042-.092.028-.084.014-.036,0-.036,0-.031-.006-.028-.011-.028-.014Z"/>
        <path d="M14.044,21.467l-.025.017-.028.008-.031.006-.034,0-.036,0-.039-.008-.09-.028-.1-.045-.106-.062-.112-.076-.12-.09-.257-.224L12.8,20.7l-.283-.313-.285-.353-.269-.367-.229-.353-.193-.333-.148-.308-.056-.137-.045-.131-.034-.118-.02-.1,0-.092,0-.039.006-.036.008-.034.014-.028.017-.025.022-.02.025-.017.028-.008.031-.006.034,0,.036,0,.039.008.09.028.1.045.106.062.112.076.12.092.257.221.274.271.283.313.285.353.266.367.232.353.193.333.148.308.056.137.045.129.034.118.017.106.006.09,0,.042-.006.036-.008.031-.014.028-.017.025Z"/>
        <path d="M8.482,27.255l-.008,0H8.457l-.011,0-.011-.006-.011-.006L8.4,27.227l-.025-.022-.025-.028-.028-.034-.031-.036-.059-.09-.062-.106-.062-.12-.059-.131L8,26.525,7.956,26.4l-.031-.118L7.9,26.173,7.9,26.125l-.006-.042V26.01l.006-.028,0-.014.006-.008.006-.011.006-.006.006-.006.008-.006.008,0h.02l.008,0,.011.006.011.006.025.017.025.022.025.028.028.034.028.036.062.09.062.106.059.12.059.131.053.134.042.129.034.118.02.106.008.048,0,.042,0,.039,0,.034-.006.028,0,.014-.006.008-.006.011-.006.006-.006.006Z"/>
        <path d="M6.731,27.387l0-.008.006-.008.006-.006.008-.006.008-.008.011-.006.028-.008.034-.008.039,0,.1-.006.112.006.126.011.14.022.145.031.145.036.131.039.12.045.1.045.084.042.034.022.028.022.02.02.008.011.006.008.006.008,0,.011v.017l0,.008-.006.008-.006.006-.008.008-.008.006-.011.006-.028.008-.034.008-.039.006-.1,0-.112,0L7.7,27.767l-.14-.02-.145-.031-.145-.036-.131-.042-.12-.042-.1-.045-.084-.045L6.8,27.485l-.028-.02-.02-.022-.008-.008-.006-.011-.006-.008,0-.011v-.017Z"/>
        <path d="M5.142,16.036l-.008.006-.008.006-.008.006-.011,0-.011,0H5.08l-.028,0-.034-.006-.036-.011-.039-.014-.042-.02-.09-.05-.1-.064-.1-.076-.1-.09-.1-.1-.087-.092-.076-.09-.059-.084-.022-.039-.02-.039-.014-.034-.011-.031-.006-.031v-.022l0-.011,0-.011.006-.008.006-.008.008-.006.008-.008.008,0,.011,0,.011,0h.042l.034.008.034.011.039.014.042.02.092.048.1.064.1.078.1.087.1.1.087.092.073.092.059.084.025.039.02.036.014.036.011.031,0,.028,0,.014,0,.011v.011l0,.011-.006.008Z"/>
        <path d="M5.472,15.843l-.008,0H5.447l-.011,0-.011-.006-.011-.006-.022-.017-.025-.022-.025-.028-.028-.034L5.282,15.7l-.059-.09L5.161,15.5l-.062-.12-.059-.131-.053-.134-.042-.129-.031-.118-.022-.106-.006-.048-.006-.042V14.6l.006-.028,0-.014.006-.008.006-.011.006-.006.006-.006.008-.006.008,0h.02l.008,0,.011.006.011.006L5,14.548l.025.022.025.028.028.034.028.036.062.09.062.106.059.12.059.131.053.134.042.129.034.118.02.106.008.048,0,.042,0,.039,0,.034-.006.028,0,.014-.006.008-.006.011-.006.006-.006.006Z"/>
        <path d="M3.718,15.975l0-.008.006-.008.006-.006.008-.006.008-.008.011-.006.028-.008.034-.008.039,0,.1-.006.112.006.126.011.14.022.145.028.145.036.131.042.12.042.1.045.084.045.034.022.028.02.02.022.008.008.006.011.006.008,0,.011V16.3l0,.008-.006.008-.006.006-.008.006-.008.008-.011.006-.028.008-.034.008-.039,0-.1.006-.112-.006-.126-.011-.14-.022L4.4,16.3l-.145-.036-.131-.039-.12-.045-.1-.042L3.821,16.1l-.034-.022L3.76,16.05l-.02-.02-.008-.011-.006-.008L3.721,16l0-.011v-.017Z"/>
        <path d="M17.393,17.8l-.006-.008-.006-.008,0-.011v-.011l0-.011,0-.011,0-.031.011-.031.014-.034.02-.039.025-.039.059-.084.073-.09.087-.092.1-.1.1-.087.1-.078.1-.064.09-.048.042-.02.039-.017.036-.011.031-.006.028,0h.014l.011,0,.011,0,.008.006.008.006.008.006.006.008.006.008,0,.008v.011l0,.011,0,.014,0,.028-.011.031-.014.034-.02.039-.022.039-.062.084-.073.09-.087.092-.1.1-.1.087-.1.078-.1.064-.092.05-.039.017-.039.017-.036.011-.034.006-.028,0h-.025l-.008,0-.011-.006L17.4,17.81Z"/>
        <path d="M17.046,17.612l-.008-.006-.006-.006-.006-.006-.006-.011-.006-.008,0-.014-.006-.028,0-.034,0-.036,0-.045.008-.048.02-.1.034-.12.042-.126.053-.134.059-.131.062-.12.062-.106.059-.09.031-.039.028-.034.025-.028.025-.02.022-.017.011-.006.011-.006.011,0h.017l.008,0,.008,0,.006.006.006.008.006.008.006.011,0,.011.006.028,0,.034,0,.039,0,.042-.008.048-.02.106-.034.118-.042.129-.053.134-.059.131-.062.12-.062.106-.059.09-.028.039-.028.034-.028.028-.025.02-.022.017-.011.006-.011.006-.011,0h-.017Z"/>
        <path d="M18.809,17.749v.017l0,.008,0,.011-.008.008-.006.011-.022.02-.028.022-.034.02-.081.045-.1.045L18.4,18l-.131.039-.145.036-.145.031-.14.02-.126.014-.112,0-.1,0-.039-.006-.034-.008-.028-.008-.011-.006-.008-.006-.008-.008-.006-.006-.006-.008,0-.008v-.017l0-.011.006-.008.006-.011.008-.008.02-.022.028-.02.034-.022.039-.022.045-.022.1-.045.12-.042.134-.039.145-.036.145-.028.137-.022.126-.011.112,0,.1,0,.039.006.034.008.028.008.011.006.008.006.008.008.006.006.006.008Z"/>
        <path d="M17.354,22.944l-.008.006-.008.006-.008.006-.011,0-.011,0h-.014l-.028,0-.034-.006-.034-.011-.039-.014-.042-.02-.092-.05-.1-.062-.1-.078-.1-.087-.1-.1-.087-.092-.076-.09-.059-.084-.022-.039-.02-.036-.017-.036-.008-.031L16.33,22.1l0-.014,0-.011v-.011l0-.011.006-.008.006-.008.008-.006.008-.006.008-.006.011,0,.011,0h.014l.031,0,.031.006.036.011.039.017.042.02.092.048.1.064.1.076.1.087.1.1.087.092.073.09.062.084.022.039.02.039.014.034.011.031,0,.031,0,.011,0,.011v.011l0,.011-.006.008Z"/>
        <path d="M17.687,22.754l-.008,0h-.017l-.011,0-.008-.006-.011-.006-.022-.017-.025-.022-.028-.028L17.5,22.6l-.059-.09-.062-.106-.062-.12-.059-.131-.053-.134-.042-.126-.031-.12-.022-.1-.011-.092,0-.036,0-.034.006-.028,0-.014,0-.008.006-.011.006-.006.006-.006.008-.006.008,0h.017l.011,0,.011.006.011.006.022.017.025.022.025.028.028.034.031.039.059.09.062.106.059.12.059.131.053.134.042.126.034.12.022.1.006.048.006.045v.07l-.006.028,0,.014-.006.008-.006.011-.006.006-.006.006Z"/>
        <path d="M15.936,22.882l0-.008.006-.008.006-.006.008-.006.008-.008.011-.006.028-.008.034-.008.039,0,.1-.006.112.006.126.011.14.022.145.031.145.036.131.039.12.045.1.045.084.042.034.022.028.022.02.02.008.011.006.008.006.008,0,.011v.017l0,.008-.006.008-.006.006-.008.008-.008.006-.011.006-.028.008-.034.008-.039.006-.1,0-.112,0-.126-.014-.14-.02-.145-.031-.145-.036-.131-.042-.12-.042-.1-.045L16.039,23l-.034-.022-.028-.02-.02-.022-.008-.008-.006-.011-.006-.008,0-.011v-.017Z"/>
        <path d="M9.218,7.042l-.025-.053-.014-.056,0-.064.006-.07L9.2,6.725l.025-.078L9.3,6.476l.118-.185.151-.2.187-.213.215-.227.52-.476.624-.5.716-.512.792-.509.817-.47.783-.4.733-.325.66-.243.3-.09.277-.064.246-.042L16.666,2l.187.006.081.014.073.02.064.025.053.031.045.042.036.045.025.053.014.056,0,.064-.006.07-.017.073-.025.078-.081.171L17,2.932l-.151.2-.187.213-.215.227-.52.476-.624.5-.716.512L13.8,5.57l-.817.47-.783.4-.733.325-.66.243-.3.087-.277.067L9.979,7.2l-.221.02-.187-.006L9.49,7.2l-.073-.02-.064-.025L9.3,7.128l-.045-.042Z"/>
        <path d="M15.533,11.63l-.064.078-.073.07-.081.064-.087.056-.092.05-.1.042-.215.064-.241.036-.257.008-.274-.017-.291-.042-.3-.07-.313-.1-.322-.118-.33-.145-.333-.168-.336-.19-.333-.215-.333-.238-.319-.255-.3-.263-.277-.269L10,9.741l-.229-.277-.2-.277L9.394,8.91l-.148-.271-.12-.269-.092-.26-.062-.249-.031-.241,0-.227.014-.106.02-.1.031-.1.039-.1L9.1,6.9l.056-.084.064-.078.073-.07.081-.064.087-.056.092-.05.1-.042.215-.064.241-.036.257-.011.274.017.291.045.3.07.313.092.322.12.33.143L12.534,7l.336.19.333.215.333.238.319.255.3.263.277.269.252.274.229.277.2.277.179.277.148.271.12.269.092.26.062.249.031.241,0,.227-.014.106-.02.1-.031.1-.039.1-.05.09Z"/>
        <path d="M12.122,9.339l-.031-.028-.028-.036-.02-.042-.017-.048-.011-.056L12.01,9.07l.006-.137.025-.159.045-.176.062-.193.081-.213.21-.462.277-.506.333-.537.386-.557.414-.537.411-.478.4-.417.378-.339.176-.14.168-.12.154-.092.143-.073.129-.045.059-.014.056-.006h.05l.048.008.042.014.036.022.031.028.028.036.022.042.014.048.011.056.006.059-.006.137-.025.157-.042.176-.064.2-.078.21-.213.464-.274.506-.333.537-.386.557-.414.534-.414.481-.4.414-.378.341-.176.14-.165.118-.157.1-.143.07-.129.048-.059.011-.056.008h-.05L12.2,9.375l-.042-.014Z"/>
        <path d="M15.27,11.795l-.056-.017-.053-.028-.048-.042-.048-.053-.045-.064-.039-.073-.073-.182-.059-.221-.048-.26-.034-.291-.02-.327,0-.739.048-.837.1-.918.157-.976.2-.968.232-.892.255-.8.269-.688.134-.3.137-.26.137-.227.134-.185.131-.143.064-.056.064-.045.062-.031.062-.022L17,2.145l.059,0,.056.017.053.028.05.042.045.053.045.064.042.076.07.179.062.221.045.26.034.294.022.325,0,.739-.05.839-.1.915-.157.976-.2.968-.232.892-.255.8-.269.691-.134.3-.137.26-.137.227-.134.185-.131.143-.064.056-.064.045-.062.031-.062.022-.059.006Z"/>
    </svg>`;
}

function getGitHubIcon() {
    return `<svg class="method-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"
        style="vertical-align: middle; display: inline-block;"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>`;
}

async function loadPackagesData() {
    try {
        showSkeleton();

        const response = await fetch(REGISTRY_URL);
        if (!response.ok) throw new Error('Erreur chargement');
        const data = await response.json();

        const validPackages = Array.isArray(data) ? data.filter(pkg => pkg && pkg.name) : [];

        packages = validPackages.map(pkg => {
            const primarySource = pkg.sources && pkg.sources[0] ? pkg.sources[0] : {};

            const cleanUrl = (url) => url ? url.trim() : '';

            let repoShortName = '';
            if (primarySource.url) {
                try {
                    const url = new URL(cleanUrl(primarySource.url));
                    repoShortName = url.pathname.replace(/^\/|\/$/g, '');
                } catch (e) {
                    repoShortName = cleanUrl(primarySource.url);
                }
            }

            return {
                name: pkg.name,
                description: pkg.description || '',
                github: repoShortName,
                tags: pkg.tags || [],
                license: primarySource.license || 'Unknown',
                sources: (pkg.sources || []).map(src => ({
                    ...src,
                    url: cleanUrl(src.url),
                    web: cleanUrl(src.web),
                    author: src.author ? src.author.trim() : 'unknown',
                    license: src.license ? src.license.trim() : 'Unknown'
                })),

                lastCommit: primarySource.last_commit || null,
                lastCommitSha: primarySource.last_commit_sha || null,
                reachable: primarySource.reachable !== false,
                archived: primarySource.archived || false,
                lastTag: primarySource.last_tag || null,

                version: primarySource.last_tag || 'v1.0.0',
                addedAt: primarySource.added_at 
                    ? primarySource.added_at.replace(' ', 'T') 
                    : 'N/A',
                web: cleanUrl(primarySource.web) || cleanUrl(primarySource.url)
            };
        });

        calculateMetrics();
        generateExploreTags();
        generateFunFacts();
        renderInterface();

        hideSkeleton();

    } catch (error) {
        console.error('Erreur:', error);
        hideSkeleton();
        const skPkg = document.getElementById('skeletonPackages');
        if (skPkg) {
            skPkg.style.display = 'flex';
            skPkg.innerHTML = '<p style="color:var(--text-secondary);padding:20px;font-size:0.85rem;">Impossible de charger les données depuis le registry.</p>';
        }
    }
}

function calculateMetrics() {
    const allTags = {};
    const allAuthors = {};
    const allDomains = {};

    packages.forEach(pkg => {
        if (pkg.tags) {
            pkg.tags.forEach(tag => {
                allTags[tag] = (allTags[tag] || 0) + 1;
            });
        }

        if (pkg.sources && pkg.sources.length > 0) {
            pkg.sources.forEach(src => {
                if (src.author) {
                    if (!allAuthors[src.author]) {
                        allAuthors[src.author] = { count: 0 };
                    }
                    allAuthors[src.author].count++;
                }
                
                if (src.url) {
                    try {
                        const url = new URL(src.url);
                        allDomains[url.hostname] = (allDomains[url.hostname] || 0) + 1;
                    } catch (e) {}
                }
            });
        }
    });

    const topTags = Object.entries(allTags)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const topAuthors = Object.entries(allAuthors)
        .map(([name, data]) => ({ name, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const domains = Object.entries(allDomains)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); // 90 jours

    // < 90 days
    const last90Days = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return false;
        return p.sources.some(src => {
            if (!src.last_commit) return false;
            const date = new Date(src.last_commit);
            return date > threeMonthsAgo;
        });
    }).length;

    // > 1 year
    const olderThanYear = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return true;
        return p.sources.every(src => {
            if (!src.last_commit) return true;
            const date = new Date(src.last_commit);
            return date < oneYearAgo;
        });
    }).length;

    const archived = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return false;
        return p.sources.some(src => src.archived === true);
    }).length;

    const unreachable = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return true;
        return p.sources.every(src => src.reachable === false);
    }).length;

    const versioned = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return false;
        return p.sources.some(src => src.last_tag || src.latest_release);
    }).length;

    metrics = {
        total: packages.length,
        authors: Object.keys(allAuthors).length,
        archived: archived,
        unreachable: unreachable,
        versioned: versioned,
        olderThanYear: olderThanYear,
        last90Days: last90Days,
        topTags: topTags,
        topAuthors: topAuthors,
        domains: domains
    };
}


function generateExploreTags() {
    exploreTags = metrics.topTags.slice(0, 10).map(t => t.name);
}

function generateFunFacts() {
    const unreachableCount = packages.filter(p => !p.reachable).length;
    const archivedCount = packages.filter(p => p.archived).length;

    funFacts = [
        `There are currently ${packages.length} packages in the registry!`,
        `Most popular tag: '${metrics.topTags[0]?.name}' with ${metrics.topTags[0]?.count} packages!`,
        `${metrics.authors} unique authors in the ecosystem!`,
        `${metrics.domains[0]?.name} hosts the most packages!`,
        `The Tcl programming language was created in 1988 by John Ousterhout.`,
        unreachableCount > 0 ? `${unreachableCount} packages are currently unreachable.` : null,
        archivedCount > 0 ? `${archivedCount} packages are archived.` : null
    ].filter(Boolean);
}

function renderInterface() {
    renderExploreTags();
    renderRecentPackages();
    renderRecentVersions();
    renderMetrics();
    rotateFunFacts();
}

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    showSkeleton();
    loadPackagesData().then(() => {
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    const header = document.getElementById('header');
                    header.classList.toggle('scrolled', window.scrollY > 30);
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        });
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
    });
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme;
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

function handleHashChange() {
    const hash = window.location.hash || '#/';

    if (hash.startsWith('#/pkg/')) {
        showPackageDetail(decodeURIComponent(hash.replace('#/pkg/', '')), false);
    } else if (hash.startsWith('#/search')) {
        showPage('searchPage');

        const queryMatch = hash.match(/[?&]q=([^&]+)/);
        const query = queryMatch ? decodeURIComponent(queryMatch[1]) : '';

        initializeSearchPage(query);
    } else if (hash === '#/metrics') {
        showPage('metricsPage');
    } else if (hash === '#/about') {
        showPage('aboutPage');
    } else {
        showPage('homePage');
        const homeInput = document.getElementById('searchInput');
        if (homeInput) homeInput.value = '';
    }
}

function initializeSearchPage(query) {
    const input = document.getElementById('searchInput2');

    if (query) {
        input.value = query;
        performSearch(query);
    } else {
        input.value = '';
        displaySearchResults(packages, '');
        const countEl = document.getElementById('resultsCount');
        if (countEl) countEl.textContent = `${packages.length} packages`;
    }
}

function navigateTo(page) {
    const pages = { home: '#/', search: '#/search', metrics: '#/metrics', about: '#/about' };
    window.location.hash = pages[page] || '#/';
}

function showPage(pageId) {
    ['homePage', 'searchPage', 'packagePage', 'metricsPage', 'aboutPage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === pageId ? 'block' : 'none';
    });
    window.scrollTo(0, 0);
}

function goBack() { window.history.back(); }

function extractShortUrl(url, type) {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        if (type === 'repo') {
            const match = url.match(/name=([^&]+)/);
            if (match) return match[1];
            return urlObj.pathname.replace(/^\/|\/$/g, '');
        } else if (type === 'doc') {
            const parts = urlObj.pathname.split('/');
            return parts[parts.length - 1];
        }
    } catch (e) { return url; }
}

function showPackageDetail(pkgName, updateHash = true) {
    const pkg = packages.find(p => p.name === pkgName);
    if (!pkg) { console.error('Package not found:', pkgName); return; }

    const sourcesCards = pkg.sources.map((src, index) => {
        const hasDifferentWeb = src.web && src.web !== src.url;
        const shortRepo = extractShortUrl(src.url, 'repo');
        const shortDoc = hasDifferentWeb ? extractShortUrl(src.web, 'doc') : null;

        const method = (src.method || 'unknown').toLowerCase();
        let methodDisplay;
        let methodClass = 'source-method';

        if (method === 'fossil') {
            methodDisplay = getFossilIcon();
            methodClass = 'source-method icon-only';
        } else if (method === 'git') {
            methodDisplay = getGitHubIcon();
            methodClass = 'source-method icon-only';
        } else {
            methodDisplay = src.method || 'unknown';
        }

        let statusBadges = '';
        if (src.archived) {
            statusBadges += `<span class="status-badge archived">Archived</span>`;
        }
        if (src.reachable === false) {
            statusBadges += `<span class="status-badge unreachable">Unreachable</span>`;
        }

        let commitRow = '';
        if (src.last_commit) {
            const date = src.last_commit.split(' ')[0];
            const sha = src.last_commit_sha ? src.last_commit_sha.substring(0, 7) : '';
            commitRow = `
            <div class="source-commit-row">
                <span class="url-label">last commit:</span>
                <span class="source-commit-text">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>${date}${sha ? ' • ' + sha : ''}</span>
                </span>
            </div>`;
        }

        const licenseRow = `
            <div class="source-license-row">
                <span class="url-label">license:</span>
                <span class="source-license-text">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="9"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <span>${src.license || 'Unknown'}</span>
                </span>
            </div>`;

        let versionRow = '';
        if (src.latest_release) {
            versionRow = `
            <div class="source-version-row">
                <span class="url-label">version:</span>
                    <span class="source-version-text">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                    <span>${src.latest_release}</span>
                </span>
            </div>`;
        }

        let tagRow = '';
        if (src.last_tag && src.last_tag !== src.latest_release) {
            tagRow = `
            <div class="source-tag-row">
                <span class="url-label">tag:</span>
                    <span class="source-tag-text">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    <span>${src.last_tag}</span>
                </span>
            </div>`;
        }

        return `
        <div class="source-card ${index === 0 ? 'primary' : ''} ${src.reachable === false ? 'unreachable' : ''} ${src.archived ? 'archived' : ''}">
            <div class="source-header">
                <div class="source-author">
                    <span class="author-label">author/orgs</span>
                    <span class="author-name">${src.author || 'unknown'}</span>
                    ${statusBadges}
                </div>
                <span class="${methodClass}">${methodDisplay}</span>
            </div>
            <div class="source-body">
                <div class="source-links">
                    <div class="source-url-row">
                        <span class="url-label">repository:</span>
                        <a href="${src.url}" target="_blank" class="source-url" title="${src.url}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            <span style="margin-left: 6px;">${shortRepo}</span>
                        </a>
                    </div>
                    ${hasDifferentWeb ? `
                    <div class="source-web-row">
                        <span class="url-label">documentation:</span>
                        <a href="${src.web}" target="_blank" class="source-web" title="${src.web}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span style="margin-left: 6px;">${shortDoc}</span>
                        </a>
                    </div>` : ''}
                    ${versionRow}
                    ${tagRow}
                    ${licenseRow}
                    ${commitRow}
                </div>
            </div>
        </div>`;
    }).join('');

    const container = document.getElementById('packageDetail');
    if (!container) return;

    let maintenanceWarning = '';
    if (pkg.archived && pkg.sources.length === 1) {
        maintenanceWarning = `<div class="maintenance-warning archived-warning">⚠️ This package is archived</div>`;
    } else if (pkg.reachable === false && pkg.sources.length === 1) {
        maintenanceWarning = `<div class="maintenance-warning unreachable-warning">⚠️ Repository currently unreachable</div>`;
    } else if (pkg.lastCommit) {
        const lastDate = new Date(pkg.lastCommit);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        if (lastDate < twoYearsAgo) {
            maintenanceWarning = `<div class="maintenance-warning stale-warning">⚠️ Last update: ${pkg.lastCommit.split(' ')[0]} (may be unmaintained)</div>`;
        }
    }

    container.innerHTML = `
        <div class="package-detail">
            ${maintenanceWarning}
            <div class="detail-header">
                <h1>${pkg.name}</h1>
                <p class="detail-desc">${pkg.description}</p>
            </div>
            <div class="detail-section">
                <h3>available sources (${pkg.sources.length}):</h3>
                <div class="sources-grid">${sourcesCards}</div>
            </div>
            <div class="detail-tags">
                ${pkg.tags.map(t => `<span class="tag" onclick="searchByTag('${t}')">${t}</span>`).join('')}
            </div>
        </div>`;

    showPage('packagePage');
    if (updateHash) window.location.hash = `#/pkg/${encodeURIComponent(pkgName)}`;
}

function renderExploreTags() {
    const el = document.getElementById('exploreTags');
    if (el) el.innerHTML = exploreTags.map(tag =>
        `<span class="tag" onclick="searchByTag('${tag}')">${tag}</span>`
    ).join('');
}

function showSkeleton() {
    const skPkg = document.getElementById('skeletonPackages');
    const realPkg = document.getElementById('packagesScrollContainer');
    if (skPkg)  skPkg.style.display  = 'flex';
    if (realPkg) realPkg.style.display = 'none';
    const skVer = document.getElementById('skeletonVersions');
    const realVer = document.getElementById('recentVersions');
    if (skVer)  skVer.style.display  = 'flex';
    if (realVer) realVer.style.display = 'none';
    const tagsEl = document.getElementById('exploreTags');
    if (tagsEl) tagsEl.innerHTML = [0,1,2,3,4,5,6,7,8,9].map(i =>
        `<span class="skeleton-tag-sm" style="--i:${i}"></span>`
    ).join('');
}

function hideSkeleton() {
    const skPkg = document.getElementById('skeletonPackages');
    const realPkg = document.getElementById('packagesScrollContainer');
    if (skPkg)  skPkg.style.display  = 'none';
    if (realPkg) realPkg.style.display = 'block';
    const skVer = document.getElementById('skeletonVersions');
    const realVer = document.getElementById('recentVersions');
    if (skVer)  skVer.style.display  = 'none';
    if (realVer) realVer.style.display = 'flex';
}

function renderRecentPackages() {
    const el = document.getElementById('recentPackages');
    if (!el) return;

    const sorted = [...packages].sort((a, b) => {
        if (!a.addedAt || a.addedAt === 'N/A') return 1;
        if (!b.addedAt || b.addedAt === 'N/A') return -1;
        return new Date(b.addedAt) - new Date(a.addedAt);
    });
    
    const isMobile = window.innerWidth <= 768;
    const totalItems = sorted.length;
    const displayCount = isMobile ? Math.min(20, totalItems) : totalItems;
    const limited = sorted.slice(0, displayCount);
    const dup = [...limited, ...limited];

    el.innerHTML = dup.map(pkg => `
        <div class="package-item" onclick="showPackageDetail('${pkg.name.replace(/'/g, "\\'")}')">
            <span class="package-name">${pkg.name}</span>
            <span class="package-desc">${pkg.description}</span>
            <span class="package-date">${pkg.addedAt ? pkg.addedAt.split(/[T ]/)[0] : 'N/A'}</span>
        </div>`).join('');

    const pxPerSecondDesktop = 32;
    const pxPerSecondMobile = 25;
    const pxPerSecond = isMobile ? pxPerSecondMobile : pxPerSecondDesktop;

    requestAnimationFrame(() => {
        const totalHeight = el.scrollHeight;
        const cycleHeight = totalHeight / 2;
        const duration = cycleHeight / pxPerSecond;
        el.style.animationDuration = `${duration}s`;
    });
}

function renderRecentVersions() {
    const el = document.getElementById('recentVersions');
    if (!el) return;
    const sorted = [...packages]
        .filter(p => p.lastTag || p.lastCommit)
        .sort((a, b) => {
            const dateA = a.lastCommit ? new Date(a.lastCommit) : new Date(0);
            const dateB = b.lastCommit ? new Date(b.lastCommit) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 11);

    el.innerHTML = sorted.map(pkg => `
        <div class="version-item" onclick="showPackageDetail('${pkg.name.replace(/'/g, "\\'")}')">
            <span class="version-name">${pkg.name}</span>
            <span class="version-number">${pkg.lastTag || 'dev'}</span>
        </div>`).join('');
}

function renderMetrics() {
    const mapping = {
        'metricTotal': 'total',
        'metricAuthors': 'authors',
        'metricArchived': 'archived',
        'metricUnreachable': 'unreachable',
        'metricVersioned': 'versioned',
        'metricOlderYear': 'olderThanYear',
        'metric90Days': 'last90Days'
    };

    Object.entries(mapping).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && metrics[key] !== undefined) {
            el.textContent = metrics[key].toLocaleString();
        }
    });

    const tagsTable = document.getElementById('tagsTable');
    if (tagsTable && metrics.topTags) {
        tagsTable.innerHTML = metrics.topTags.map(tag => `
            <tr>
                <td><a href="#/search" onclick="searchByTag('${tag.name}'); return false;">${tag.name}</a></td>
                <td class="num">${tag.count}</td>
            </tr>
        `).join('');
    }

    const authorsTable = document.getElementById('authorsTable');
    if (authorsTable && metrics.topAuthors) {
        authorsTable.innerHTML = metrics.topAuthors.map(author => `
            <tr>
                <td>${author.name}</td>
                <td class="num">${author.count}</td>
            </tr>
        `).join('');
    }

    const domainsTable = document.getElementById('domainsTable');
    if (domainsTable && metrics.domains) {
        domainsTable.innerHTML = metrics.domains.map(domain => `
            <tr>
                <td>${domain.name}</td>
                <td class="num">${domain.count}</td>
            </tr>
        `).join('');
    }
}

function rotateFunFacts() {
    const el = document.getElementById('funFact');
    if (!el) return;
    let idx = Math.floor(Math.random() * funFacts.length);
    el.textContent = funFacts[idx];
    setInterval(() => {
        idx = (idx + 1) % funFacts.length;
        el.style.opacity = '0';
        setTimeout(() => { el.textContent = funFacts[idx]; el.style.opacity = '1'; }, 300);
    }, 5000);
}

function handleSearch(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const query = input.value.trim();

    if (!query) {
        window.location.hash = '#/search';
    } else {
        window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
    }
    return false;
}

function searchByTag(tag) {
    window.location.hash = `#/search?q=${encodeURIComponent('tag:' + tag)}`;
}

function performSearch(query) {
    showSearchSkeleton();
    let results = [...packages];

    const trimmedQuery = query ? query.trim().toLowerCase() : '';

    if (trimmedQuery) {
        if (trimmedQuery.startsWith('tag:')) {
            const t = trimmedQuery.replace('tag:', '');
            results = results.filter(p => p.tags.some(tag => tag.toLowerCase().includes(t)));
        } else {
            results = results.filter(p =>
                p.name.toLowerCase().includes(trimmedQuery) ||
                p.description.toLowerCase().includes(trimmedQuery) ||
                p.tags.some(t => t.toLowerCase().includes(trimmedQuery)) ||
                p.sources.some(s => s.author && s.author.toLowerCase().includes(trimmedQuery))
            );
        }
    }

    displaySearchResults(results, query);

    const input = document.getElementById('searchInput2');
    if (input && query !== undefined) input.value = query;
}

function displaySearchResults(results, query) {
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
        if (query && query.trim() !== '') {
            countEl.textContent = `${results.length}/${packages.length} packages matching "${query}"`;
        } else {
            countEl.textContent = `${results.length} packages`;
        }
    }

    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No packages found.</p>';
        return;
    }

    container.innerHTML = results.map(pkg => `
        <div class="result-item" onclick="showPackageDetail('${pkg.name.replace(/'/g, "\\'")}')">
            <div class="result-header">
                <span class="result-name">${pkg.name}</span>
                ${pkg.archived ? '<span class="mini-badge archived">archived</span>' : ''}
                ${!pkg.reachable ? '<span class="mini-badge unreachable">unreachable</span>' : ''}
            </div>
            <p class="result-desc">${pkg.description}</p>
            <div class="result-meta">
                <span>${pkg.sources.length} source(s)</span>
                <span>license: ${pkg.license}</span>
                ${pkg.lastCommit ? `<span>updated: ${pkg.lastCommit.split(' ')[0]}</span>` : ''}
            </div>
            <div class="result-tags">
                ${pkg.tags.map(t => `<span class="result-tag" onclick="event.stopPropagation(); searchByTag('${t}')">${t}</span>`).join('')}
            </div>
        </div>`).join('');
}

function showSearchSkeleton() {
    const container = document.getElementById('searchResults');
    if (!container) return;
    container.innerHTML = [0,1,2,3,4].map(i =>
        `<div class="skeleton-result" style="--i:${i}"></div>`
    ).join('');
}

function sortResults() {
    const sortBy = document.getElementById('sortSelect')?.value;
    const query = document.getElementById('searchInput2')?.value.trim() || '';

    let results = [...packages];

    if (query.startsWith('tag:')) {
        const t = query.replace('tag:', '').toLowerCase();
        results = results.filter(p => p.tags.some(tag => tag.toLowerCase().includes(t)));
    } else if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }

    const sorts = {
        recent: (a, b) => {
            if (!a.lastCommit) return 1;
            if (!b.lastCommit) return -1;
            return new Date(b.lastCommit) - new Date(a.lastCommit);
        },
        oldest: (a, b) => {
            if (!a.lastCommit) return 1;
            if (!b.lastCommit) return -1;
            return new Date(a.lastCommit) - new Date(b.lastCommit);
        },
        az: (a, b) => a.name.localeCompare(b.name),
        za: (a, b) => b.name.localeCompare(a.name)
    };
    results.sort(sorts[sortBy] || sorts.az);
    displaySearchResults(results, query);
}

window.toggleTheme = toggleTheme;
window.navigateTo = navigateTo;
window.showPackageDetail = showPackageDetail;
window.goBack = goBack;
window.handleSearch = handleSearch;
window.searchByTag = searchByTag;
window.sortResults = sortResults;
window.showSearchSkeleton = showSearchSkeleton;