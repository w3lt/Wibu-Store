$$
best\_deal\_point = \sqrt{|1-\frac{price}{avg\_price}|^2 * 0.55 + |1-\frac{size}{avg\_size}|^2 * 0.15 + \delta_1 * 0.15 + \delta_2 * 0.15}
$$
where
+ best_deal_point is the index that decide if we should display this game to this user. Lower best_deal_point mean that we should
+ price is current price of this game
+ avg_price is the average of price of games in favorite list of this user
+ size is the size of this game
+ avg_size is the average of size of games in favorite list of this user
+ $\delta_1 = 0$ if the developer of this game is in favorite list else $1$
+ $\delta_2 = 0$ if the genre of this game is in favorite list else $0$