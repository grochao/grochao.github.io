/**
 * Convierte un número a texto en español con formato de cheque:
 *   "mil setecientos ochenta y ocho con 78/100"
 *
 * @example
 *   const conv = new NumeroALetras()
 *   conv.convertir('1,788.78') // → "mil setecientos ochenta y ocho con 78/100"
 *   conv.convertir('1788.78')  // → "mil setecientos ochenta y ocho con 78/100"
 */
class NumeroALetras {
    static UNIDADES = [
        'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
        'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince'
    ]
    static DECENAS_ESP = {
        16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve'
    }
    static VEINTENAS = [
        'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro',
        'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
    ]
    static DECENAS = {
        30: 'treinta', 40: 'cuarenta', 50: 'cincuenta',
        60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa'
    }
    static CENTENAS = {
        100: 'cien', 200: 'doscientos', 300: 'trescientos', 400: 'cuatrocientos',
        500: 'quinientos', 600: 'seiscientos', 700: 'setecientos',
        800: 'ochocientos', 900: 'novecientos'
    }

    /**
     * @param {{ conector?: string }} [options]
     *   - conector: palabra entre la parte entera y los decimales. Default `'con'`.
     */
    constructor(options = {}) {
        this.conector = options.conector ?? 'con'
    }

    /**
     * Convierte un número o string numérico al formato de cheque.
     * @param {number|string|bigint} input
     * @returns {string}
     * @throws {TypeError|RangeError|Error} si la entrada no es parseable.
     */
    convertir(input) {
        const { int, dec, neg } = this._parse(input)
        const negStr = neg ? 'menos ' : ''
        const parteEntera = this._enteroALetras(int)
        const decStr = String(dec).padStart(2, '0')
        return `${negStr}${parteEntera} ${this.conector} ${decStr}/100`
    }

    /**
     * Parsea la entrada y devuelve `{ int: bigint, dec: number, neg: boolean }`.
     * Acepta formatos:
     *   - `1788.78`      (plano)
     *   - `1,788.78`     (coma = miles, punto = decimal)
     *   - `1.788,78`     (punto = miles, coma = decimal, UE)
     *   - `1,788`        (coma = miles)
     *   - `1788`         (entero)
     *   - `-5.25`        (negativo)
     * @private
     */
    _parse(input) {
        if (typeof input === 'number') {
            if (!Number.isFinite(input)) throw new TypeError(`Número inválido: ${input}`)
            if (Math.abs(input) >= 1e21) throw new RangeError('Número demasiado grande; usa string')
            input = input.toFixed(2)
        }
        if (typeof input !== 'string') throw new TypeError('La entrada debe ser string o number')

        let s = input.trim()
        if (!s) throw new Error('La entrada está vacía')

        const neg = s.startsWith('-')
        if (neg) s = s.slice(1)

        s = s.replace(/[\s$€£]/g, '')
        if (!s) throw new Error('La entrada está vacía tras normalizar')
        if (!/^[\d.,]+$/.test(s)) throw new Error(`Caracteres inválidos: "${input}"`)

        const hasDot = s.includes('.')
        const hasComma = s.includes(',')
        let intPart
        let decPart = '0'

        if (hasDot && hasComma) {
            const lastDot = s.lastIndexOf('.')
            const lastComma = s.lastIndexOf(',')
            if (lastDot > lastComma) {
                intPart = s.slice(0, lastDot).replace(/,/g, '')
                decPart = s.slice(lastDot + 1)
            } else {
                intPart = s.slice(0, lastComma).replace(/\./g, '')
                decPart = s.slice(lastComma + 1)
            }
        } else if (hasComma) {
            if (/^\d{1,3}(,\d{3})+$/.test(s)) {
                intPart = s.replace(/,/g, '')
            } else if (/^\d+,\d{1,2}$/.test(s)) {
                const i = s.lastIndexOf(',')
                intPart = s.slice(0, i)
                decPart = s.slice(i + 1)
            } else if (/,\d{3}$/.test(s)) {
                intPart = s.replace(/,/g, '')
            } else {
                throw new Error(`Formato numérico no reconocido: "${input}"`)
            }
        } else if (hasDot) {
            const i = s.lastIndexOf('.')
            intPart = s.slice(0, i)
            decPart = s.slice(i + 1)
        } else {
            intPart = s
        }

        if (intPart === '') intPart = '0'
        if (!/^\d+$/.test(intPart)) throw new Error(`Parte entera inválida: "${intPart}"`)
        if (!/^\d+$/.test(decPart)) throw new Error(`Parte decimal inválida: "${decPart}"`)

        // Redondeo half-up a 2 decimales
        const padded = decPart.padEnd(3, '0')
        const roundUp = Number(padded[2]) >= 5 ? 1 : 0
        let decNum = Number(padded.slice(0, 2)) + roundUp

        let intNum = BigInt(intPart)
        if (decNum >= 100) {
            intNum += 1n
            decNum = 0
        }
        return { int: intNum, dec: decNum, neg }
    }

    /**
     * Convierte un BigInt no negativo a letras en español (masculino).
     * @param {bigint} n
     * @returns {string}
     * @private
     */
    _enteroALetras(n) {
        const U = NumeroALetras.UNIDADES
        const DE = NumeroALetras.DECENAS_ESP
        const V = NumeroALetras.VEINTENAS
        const D = NumeroALetras.DECENAS
        const C = NumeroALetras.CENTENAS

        if (n < 0n) return 'menos ' + this._enteroALetras(-n)
        if (n === 0n) return 'cero'
        if (n < 16n) return U[Number(n)]
        if (n < 20n) return DE[Number(n)]
        if (n < 30n) return V[Number(n) - 20]
        if (n < 100n) {
            const d = Number(n / 10n) * 10
            const u = Number(n % 10n)
            return u === 0 ? D[d] : `${D[d]} y ${U[u]}`
        }
        if (n === 100n) return 'cien'
        if (n < 1000n) {
            const c = Number(n / 100n) * 100
            const r = n % 100n
            return r === 0n ? C[c] : `${C[c]} ${this._enteroALetras(r)}`
        }
        if (n < 1_000_000n) {
            const miles = n / 1000n
            const r = n % 1000n
            const milesStr = miles === 1n
                ? 'mil'
                : `${this._apocopar(this._enteroALetras(miles))} mil`
            return r === 0n ? milesStr : `${milesStr} ${this._enteroALetras(r)}`
        }
        if (n < 1_000_000_000_000n) {
            const millones = n / 1_000_000n
            const r = n % 1_000_000n
            const millonesStr = millones === 1n
                ? 'un millón'
                : `${this._apocopar(this._enteroALetras(millones))} millones`
            return r === 0n ? millonesStr : `${millonesStr} ${this._enteroALetras(r)}`
        }
        if (n < 1_000_000_000_000_000_000n) {
            const billones = n / 1_000_000_000_000n
            const r = n % 1_000_000_000_000n
            const billonesStr = billones === 1n
                ? 'un billón'
                : `${this._apocopar(this._enteroALetras(billones))} billones`
            return r === 0n ? billonesStr : `${billonesStr} ${this._enteroALetras(r)}`
        }
        throw new RangeError('Número demasiado grande (máximo 999.999.999.999.999.999)')
    }

    /**
     * Aplica apócope a `uno` → `un` / `veintiuno` → `veintiún` / `… y uno` → `… y un`.
     * Necesario antes de `mil`, `millón`, `billón`.
     * @param {string} str
     * @returns {string}
     * @private
     */
    _apocopar(str) {
        if (str === 'uno') return 'un'
        if (str.endsWith('veintiuno')) return str.slice(0, -9) + 'veintiún'
        if (str.endsWith(' y uno')) return str.slice(0, -5) + ' y un'
        if (str.endsWith('uno')) return str.slice(0, -3) + 'un'
        return str
    }
}
if (typeof window !== 'undefined') {
    window.NumeroALetras = new NumeroALetras();
}