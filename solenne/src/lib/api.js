export async function getOrderLocation(orderId) {
    const res = await fetch(`/api/orders/${orderId}/location`);
    if (!res.ok) throw new Error('Failed to fetch location');
    return res.json();
  }
  