
import { getCart } from '../service/cart'

export default {
  async updateCart(ctx) {
    const res = await getCart()
    if(res.data == null) {
      ctx.commit('addCart', {
        count: 0
      })
    } else {
      ctx.commit('addCart', {
        count: res.data.cartItems.length
      })
    }
  }
}
