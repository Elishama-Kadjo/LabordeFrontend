// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success', text: string, status: number
			}
		}
	}
}

type User = {
	pk: number
	email: string
	first_name: string
	last_name: string
}

export interface PolyModel {
	id: string
	created_at: Date
	updated_at: Date
	active: boolean
}

export interface Like extends PolyModel {
	user: string
	real_estate: RealEstate
}

export interface BankImage extends PolyModel {
	image: string
}

export interface RealEstate extends PolyModel {
	title: string
	description: string
	address: string
	area: number
	price: number
	image_first: string
	image_second: string
	slug: string
	real_estate_type: string
	likes: number
	is_available: boolean

}

export interface RealEstateDetail extends RealEstate {
	has_pool: boolean
	has_garden: boolean
	images: BankImage[]
}

export interface RealEstateFavorite extends PolyModel {
	user: string
	real_estate: RealEstate
}