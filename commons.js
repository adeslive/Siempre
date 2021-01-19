const STRINGS = {
    TITLE: 'Siempre',
    SCREENS: {
        HOME: 'Siempre',
        ABOUT: "Offers",
        EXIT: "Exit"
    },
}

const URLS = {
    ROOT:"https://webstore.ftssol.com/",
    HOMEPAGE: "https://webstore.ftssol.com/CygnusWebStore_Siempre/en/",
    ABOUT_US: "https://siempregrocery.com/offers"
}

const COLORS = {
    PRIMARY_COLOR: "#84c454",
    WHITE: "#ffffff",
    BLUE: "#307fe2",
    YELLOW: "#ffc300",
    ORANGE: "#f08721",
    BLACK: "#000000",
    LOADER_BG_COLOR: 'rgba(0, 0, 0, 0.05)'
}

const IMAGES = {
    FLIP_IMAGE: require('./assets/flip.png'),
    NO_INTERNET: require('./assets/nointernet.png'),
    MENU: {
        HAMBURGUER: require('./assets/md-menu.png'),
        ARROWS: {
            LEFT: require('./assets/md-left-arrow.png'),
            RIGHT: ''
        },
        HOME: require('./assets/home.png'),
        ABOUT_US: require('./assets/offer.png'),
        EXIT: require('./assets/exit.png'),
    }
}

export {
    STRINGS,
    URLS,
    COLORS,
    IMAGES
}