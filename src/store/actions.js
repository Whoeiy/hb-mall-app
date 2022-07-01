
import { getCart } from '../service/cart'

export default {
  async updateCart(ctx) {
    const { data } = await getCart()
    ctx.commit('addCart', {
      count: data.cartItems.length || 0
    })
  }
}
