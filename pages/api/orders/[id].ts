import api from "lib/api";
import { getOrder } from "lib/actions/orders";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const order = await getOrder(api, id);
      // console.log('inside api get order req 20', order)
      res.status(200).json({ order });
    } catch (error) {
      // console.log('fetch error', error)
      res.status(500).json({ error: "Failed to fetch order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
