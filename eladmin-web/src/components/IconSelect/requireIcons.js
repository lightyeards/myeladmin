const modules = import.meta.glob('../../assets/icons/svg/*.svg', { eager: true })
const re = /\/([^/]+)\.svg$/

const icons = Object.keys(modules).map((p) => p.match(re)[1])

export default icons
