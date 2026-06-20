export interface Comment {
  id: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  comments: Comment[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Tips for Baking the Perfect Cake",
    slug: "tips-for-baking-the-perfect-cake",
    content: "Baking is both an exquisite science and an art form. To help you elevate your home baking to artisanal standards, here are our professional tips straight from the Sweet Delights kitchen:\n\n### 1. Temperature is Everything\nAlways ensure your butter, eggs, and dairy are at room temperature unless the recipe specifies otherwise. Room temperature ingredients emulsify much better, holding air bubbles that expand during baking for a cloud-soft rise.\n\n### 2. Guard the Cocoa Quality\nNever compromise on chocolate. We exclusively use rich, single-origin Ecuadorian cocoa to construct our decadent sponge layers. High-grade cocoa contains natural fats that prevent the final sponge from drying out under city dry heat.\n\n### 3. Whipping Eggs & Foaming\nWhen preparing custom tiered sponge bases, whip the egg yolks and premium sugar crystals until they form pale ribbons (the 'ribbon stage'). Fold the whipped egg whites inside with absolute light delicacy using a silicone spatula. Over-mixing will deflate the sponge.\n\n### 4. Know Your Oven Calibrations\nEven custom professional bakeries face oven discrepancy. Use an independent oven thermometer hook inside. If your oven drafts hot, place an insulated water bath underneath to generate uniform moist convection currents.\n\nHappy baking, and remember that patience is the ultimate ingredient!",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&auto=format&fit=crop&q=80",
    category: "Baking Secrets",
    createdAt: "2026-06-15T10:00:00Z",
    comments: [
      {
        id: "comment-1",
        userName: "Rohan Deshmukh",
        userEmail: "rohan@example.com",
        content: "These tips saved my vanilla sponge! The water bath trick made it incredibly soft.",
        createdAt: "2026-06-16T12:30:00Z"
      }
    ]
  },
  {
    id: "post-2",
    title: "Behind the Scenes at Sweet Delights",
    slug: "behind-the-scenes-at-sweet-delights",
    content: "Have you ever wondered what goes on inside our luxury confectionery before dawn breaks? Today, we invite you behind the scenes to peer into our master workspace.\n\n### The Golden Morning Rush\nAt 4:00 AM, while Bengaluru is fast asleep, Chef Varshini and the pastry culinary squad fire up the ovens. The air is immediately filled with the rich aroma of baking cardamom, clarifying ghee, and pure vanilla seeds.\n\n### Hand-Sculpting Masterpieces\nEvery single cake is a unique masterpiece. For our signature 24K Gold Leaf Standard, our decorators carefully place individual sheets of 99.9% pure edible French gold foil onto cooling glaze. This is a delicate process requiring stable hands, specialized soft brushes, and zero breeze in the room.\n\n### Climate-Insulated Dispatches\nTo lock in freshness, transit is run like military operations. Every finished cake is escorted immediately into custom cold insulation cooling coaches. This keeps fragile multi-tiered designs pristine and safe from melting or slipping in the heavy afternoon sun.\n\nEverything we create at Sweet Delights is a blend of traditional values and AI-enabled efficiency. We are thrilled to share our passion with you!",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
    category: "Inside the Kitchen",
    createdAt: "2026-06-16T14:00:00Z",
    comments: [
      {
        id: "comment-2",
        userName: "Ananya Sen",
        userEmail: "ananya@example.com",
        content: "I ordered the Rasmalai Fusion Cake last week and seeing the care that goes into it makes me love Sweet Delights even more!",
        createdAt: "2026-06-17T08:15:00Z"
      },
      {
        id: "comment-6qda0",
        userName: "varshu",
        userEmail: "varshini123@gmail.com",
        content: "HII",
        createdAt: "2026-06-19T13:46:39.183Z"
      }
    ]
  }
];
