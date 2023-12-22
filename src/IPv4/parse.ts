import type { IPv4 } from "./common"
import { fromBytes } from "./fromBytes"
import { parseIntAuto } from "./parseIntAuto"

/** @returns Parsed IPv4 address or `undefined` if invalid. */
export function parse(string: string): IPv4 | undefined {
	let match

	// parseInt recognizes all that octal & hexadecimal weirdness for us
	if ((match = /^(\d+|0x[a-f\d]+)\.(\d+|0x[a-f\d]+)\.(\d+|0x[a-f\d]+)\.(\d+|0x[a-f\d]+)$/i.exec(string))) {
		const bytes: [ number, number, number, number ] = [
			parseIntAuto(match[1]!),
			parseIntAuto(match[2]!),
			parseIntAuto(match[3]!),
			parseIntAuto(match[4]!)
		]

		if (bytes.every(byte => !isNaN(byte) && byte >= 0 && byte <= 0xFF))
			return fromBytes(...bytes)
	} else if ((match = /^(\d+|0x[a-f\d]+)$/i.exec(string))) {
		const value = parseIntAuto(match[1]!)

		if (!isNaN(value) && value <= 0xFF_FF_FF_FF && value >= 0)
			return fromBytes((value >> 24) & 0xFF, (value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF)
	} else if ((match = /^(\d+|0x[a-f\d]+)\.(\d+|0x[a-f\d]+)$/i.exec(string))) {
		const firstOctet = parseIntAuto(match[1]!)
		const lastOctets = parseIntAuto(match[2]!)

		if (!isNaN(firstOctet) && !isNaN(lastOctets) && firstOctet <= 0xFF && firstOctet >= 0 &&
			lastOctets <= 0xFF_FF_FF && lastOctets >= 0
		)
			return fromBytes(firstOctet, (lastOctets >> 16) & 0xFF, (lastOctets >> 8) & 0xFF, lastOctets & 0xFF)
	} else if ((match = /^(\d+|0x[a-f\d]+)\.(\d+|0x[a-f\d]+)\.(\d+|0x[a-f\d]+)$/i.exec(string))) {
		const firstOctet = parseIntAuto(match[1]!)
		const secondOctet = parseIntAuto(match[2]!)
		const lastOctets = parseIntAuto(match[3]!)

		if (!isNaN(firstOctet) && !isNaN(secondOctet) && !isNaN(lastOctets) &&
			firstOctet <= 0xFF && firstOctet >= 0 && secondOctet <= 0xFF &&
			secondOctet >= 0 && lastOctets <= 0xFF_FF && lastOctets >= 0
		)
			return fromBytes(firstOctet, secondOctet, (lastOctets >> 8) & 0xFF, lastOctets & 0xFF)
	}
}
