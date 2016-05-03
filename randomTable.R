
randomCategory = function(ncats, prefix, size) {
  cats = paste(prefix,1:ncats,sep=' ')
  sample(cats, size, replace=T)
}
randomScore = function (minV, maxV, size) {
  runif(size, minV, maxV)
}
randomInt = function (minV, maxV, size) {
  sample(minV:maxV, size, replace=T)
}
names = function (prefix, size) {
  paste(prefix,1:size,sep=' ')
}


size = 1000
a = data.frame(id=1:size, a_name = names('A',size), 
          a_cat1 = randomCategory(3, 'ACat', size) , 
          a_cat2 = randomCategory(5, 'ACatB', size), 
          a_int=randomInt(0,100, size), 
          a_real=randomScore(-1,1, size)
)
size_b = 100
b = data.frame(id=1:size_b, a_name = names('B',size_b), 
               a_cat1 = randomCategory(3, 'BCat', size_b) , 
               a_cat2 = randomCategory(5, 'BCatB', size_b), 
               a_int=randomInt(0,100, size_b), 
               a_real=randomScore(-1,1, size_b)
)
size_ab = size * size_b
ab = data.frame(a_id=sort(rep(1:size, size_b)), b_id = rep(1:size_b, size), ab_cat = randomCategory(3, 'ABCat', size_ab) , 
               ab_int=randomInt(0,100, size_ab), 
               ab_real=randomScore(-1,1, size_ab)
)

write.table(a, 'a.csv', sep=';', row.names=F)
write.table(b, 'b.csv', sep=';', row.names=F)
write.table(ab, 'ab.csv', sep=';', row.names=F)

