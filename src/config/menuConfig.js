const menuList = [
    {
        title: 'Home page', // 菜单标题名称
        key: '/home', // 对应的path
        icon: 'home', // 图标名称
        isPublic: true
    },
    {
        title: 'Products',
        key: '/products',
        icon: 'appstore',
        children: [ // 子菜单列表
            {
                title: 'Categories',
                key: '/category',
                icon: 'bars'
            },
            {
                title: 'Products',
                key: '/product',
                icon: 'tool'
            },
        ]
    },
    {
        title: 'User Management',
        key: '/user',
        icon: 'user'
    },
    {
        title: 'Role Management',
        key: '/role',
        icon: 'safety',
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: 'bar-chart',
                key: '/charts/bar',
                icon: 'bar-chart'
            },
            {
                title: 'line-chart',
                key: '/charts/line',
                icon: 'line-chart'
            },
            {
                title: 'pie-chart',
                key: '/charts/pie',
                icon: 'pie-chart'
            },
        ]
    },
]
export default menuList
