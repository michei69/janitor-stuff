export class HTMLClasses {
    private static INSTANCE: HTMLClasses
    found = new Set<string>()
    files: { [key: string]: Set<string> } = {}

    static getInstance() {
        if (!HTMLClasses.INSTANCE) {
            HTMLClasses.INSTANCE = new HTMLClasses()
        }
        return HTMLClasses.INSTANCE
    }
    add(classList: DOMTokenList) {
        for (const val of classList.value.split(" "))
            this.found.add(val)
    }
    find(prefix: string): string[] {
        return [...this.found.values()].filter((a) => a.startsWith(prefix))
    }
    findFirst(prefix: string) {
        return this.find(prefix)?.[0]
    }
    findLast(prefix: string) {
        const results = this.find(prefix)
        return results.length - 1 >= 0 ? results[results.length - 1] : undefined
    }
    findFirstAfterFirst(firstPrefix: string, secondPrefix: string) {
        const first = this.findFirst(firstPrefix)
        if (!first) return undefined
        const fnd = [...this.found.values()]
        const firstIdx = fnd.findIndex(a => a == first)
        if (firstIdx == -1) return undefined
        const second = [...this.found.values()].slice(firstIdx).filter((a) => a.startsWith(secondPrefix))
        return second?.[0]
    }

    addFile(fileName: string, classList: Set<string>) {
        this.files[fileName] = classList
    }
    existsFile(fileName: string) {
        return fileName in this.files && this.files[fileName]
    }
    existsFilePrefix(filePrefix: string) {
        return Object.keys(this.files).some(f => f.startsWith(filePrefix))
    }
    findInFile(filePrefix: string, prefix: string): string[] {
        for (const [key, val] of Object.entries(this.files)) {
            if (key.startsWith(filePrefix)) {
                const list: string[] = [...val.values()].filter((a) => a.startsWith(prefix))
                return list
            }
        }
        return []
    }
    findFirstInFile(filePrefix: string, prefix: string): string | undefined {
        return this.findInFile(filePrefix, prefix)?.[0]
    }
    findLastInFile(filePrefix: string, prefix: string): string | undefined {
        const results = this.findInFile(filePrefix, prefix)
        return results.length - 1 >= 0 ? results[results.length - 1] : undefined
    }
    findFirstAfterFirstInFile(filePrefix: string, firstPrefix: string, secondPrefix: string) {
        const first = this.findFirstInFile(filePrefix, firstPrefix)
        if (!first) return undefined
        for (const [key, val] of Object.entries(this.files)) {
            if (key.startsWith(filePrefix)) {
                const firstIdx = [...val.values()].findIndex(a => a == first)
                if (firstIdx == -1) continue
                const second = [...val.values()].slice(firstIdx).filter(a => a.startsWith(secondPrefix))
                return second?.[0]
            }
        }
        return undefined
    }
}

export function getOrDefault(prefix: string, def: string) {
    const cls = HTMLClasses.getInstance().findFirst(prefix)
    return cls || def
}