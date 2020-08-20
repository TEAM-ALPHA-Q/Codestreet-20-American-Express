-- Update the values(first run this piece of code.)
UPDATE Customer_without_features
set Difference_in_days = 0,
Rating = 0
where Return_Type = 0;


-- Create new table for features
select Customer_ID,
sum(case when Return_Type = 1 
then Return_Type
else 0
end) as Return_Orders, 
count(*) as Total_Orders, 
sum(Amount), 
sum(case when Return_Type >= 1
then Amount
else NULL end) as Refund_Amount,
sum(Difference_in_days), 
avg(case when Return_Type = 1 
then Rating
else NULL end) as Rating
from Customer_without_features 
group by Customer_ID;

-- Now export the table formed in csv format.