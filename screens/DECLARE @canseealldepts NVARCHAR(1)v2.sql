DECLARE @canseealldepts NVARCHAR(1) 

SELECT @canseealldepts = canseealldepts 
FROM   zzzz_accesslevels 
WHERE  id IN (SELECT accesslvlid 
              FROM   b_employees b 
              WHERE  b.username = '&&__ses_username&&') 

SET @canseealldepts=Isnull(@canseealldepts, 'Y') 

SELECT 1                                                             linex_, 
       '100100000000010282' 
       screenhandler, 
       p.id                                                          productid, 
       d.upc, 
       desc_en                                                       Product, 
       Count(DISTINCT s.id)                                          Sales, 
       Count(DISTINCT wicpan)                                        Custs, 
       Sum(finalsaleorreturnamt)                                     WICSaleAmt, 
       Sum(finalsaleorreturnamt) - Sum(unitcost * ( CASE 
                                                      WHEN netweight > 0 THEN 
                                                      1.0000 * 
                                                      netweight 
                                                      ELSE 1.0000 * netquantity 
                                                    END )) 
       WICProfitAmt, 
       CONVERT(NUMERIC(19, 2), 100.0000 * ( Sum(finalsaleorreturnamt) - Sum( 
                                                                    unitcost * ( 
                                            CASE 
                                                      WHEN netweight > 0 
                                            THEN 
                                                      netweight * 1.0000 
                                                      ELSE 
                                            netquantity * 1.0000 
                                                    END )) ) / ( 
                               CASE 
                                 WHEN 
                                                       Sum(finalsaleorreturnamt) 
                                                       <> 0 
                               THEN 
                                 Sum( 
                                                       finalsaleorreturnamt) 
                                                                ELSE NULL 
                                                              END )) 
       WICProfitMargin, 
       CONVERT(NUMERIC(19, 2), 1.00 * Sum(CASE 
                                            WHEN netweight > 0 THEN netweight 
                                            ELSE netquantity 
                                          END))                      WICqty, 
       Min(unitcost)                                                 minunitcost 
       , 
       Min(finalsaleorreturnamt / ( CASE 
                                      WHEN Isnull(netweight, 0) <> 0 THEN 
                                      netweight 
                                      ELSE 
                                        CASE 
                                          WHEN netquantity <> 0 THEN netquantity 
                                          ELSE NULL 
                                        END 
                                    END )) 
       minunitprice, 
       Avg(unitcost)                                                 unitcost, 
       Avg(finalsaleorreturnamt / ( CASE 
                                      WHEN Isnull(netweight, 0) <> 0 THEN 
                                      netweight 
                                      ELSE 
                                        CASE 
                                          WHEN netquantity <> 0 THEN netquantity 
                                          ELSE NULL 
                                        END 
                                    END ))                           unitprice, 
       Max(unitcost)                                                 maxunitcost 
       , 
       Max(finalsaleorreturnamt / ( CASE 
                                      WHEN Isnull(netweight, 0) <> 0 THEN 
                                      netweight 
                                      ELSE 
                                        CASE 
                                          WHEN netquantity <> 0 THEN netquantity 
                                          ELSE NULL 
                                        END 
                                    END )) 
       maxunitprice, 
       CONVERT(NUMERIC(19, 2), Sum(finalsaleorreturnamt) * 100 / 
                               ( tot_ + 0.0001 )) 
                                   pct_,/*max(convert(money, ap.maxprice)/100)*/ 
       NULL                                                          wicprice 
FROM   s_transummary s WITH (nolock) 
       INNER JOIN (SELECT Sum(transubtotalamt) tot_ 
                   FROM   s_transummary s 
                   WHERE  transtatus = 1 
                          AND s.trandate BETWEEN CONVERT(DATETIME, '&&sfrom&&') 
                                                 - && 
                                                 sdays && +1 
                                                 AND 
                                                 '&&sfrom&&' 
                          AND ( '&&sstoreid&&' = '-1' 
                                 OR ( '&&sstoreid&&' <> '-1' 
                                      AND s.storeid = '&&sstoreid&&' ) )) xs 
               ON 1 = 1 
       INNER JOIN s_trandetail d WITH (nolock) 
               ON s.id = d.transummaryid 
                  AND itemstatus IN ( 1, 7, 9 ) 
       /* left join d_wicapprovedproducts ap on ap.upc=left('00000000000000000', 17 - len(d.upc)) + d.upc */
       LEFT JOIN d_productsn p 
              ON p.id = productid 
       LEFT JOIN d_productcategories sscat 
              ON subcatg_id = sscat.id 
                 AND sscat.catg_level = 4 
       LEFT JOIN d_productcategories scatg 
              ON sscat.catg_parent_id = scatg.id 
                 AND scatg.catg_level = 3 
       LEFT JOIN d_productcategories ssdep 
              ON scatg.catg_parent_id = ssdep.id 
                 AND ssdep.catg_level = 2 
       LEFT JOIN d_productcategories sdept 
              ON ssdep.catg_parent_id = sdept.id 
                 AND sdept.catg_level = 1 
       LEFT JOIN c_employeedeptxref x 
              ON x.username = '&&__ses_username&&' 
                 AND Isnull(deptactive, 'Y') = 'Y' 
                 AND ( ( Isnull(x.scatid, -1) <>- 1 
                         AND x.scatid = sscat.id ) 
                        OR ( Isnull(x.scatid, -1) = -1 
                             AND Isnull(x.catgid, -1) <>- 1 
                             AND x.catgid = scatg.id ) 
                        OR ( Isnull(x.scatid, -1) = -1 
                             AND Isnull(x.catgid, -1) = -1 
                             AND Isnull(x.sdepid, -1) <>- 1 
                             AND x.sdepid = ssdep.id ) 
                        OR ( Isnull(x.scatid, -1) = -1 
                             AND Isnull(x.catgid, -1) = -1 
                             AND Isnull(x.sdepid, -1) = -1 
                             AND Isnull(x.deptid, -1) <>- 1 
                             AND x.deptid = sdept.id ) ) 
WHERE  ( '&&__ses_seclvl&&' = 'A' 
          OR @canseealldepts = 'Y' 
          OR @canseealldepts = 'N' 
             AND NOT x.id IS NULL ) 
       AND ( '&&sscat&&' = '-1' 
              OR ( '&&sscat&&' <> '-1' 
                   AND sscat.id LIKE '&&sscat&&' ) ) 
       AND ( '&&scatg&&' = '-1' 
              OR ( '&&scatg&&' <> '-1' 
                   AND scatg.id LIKE '&&scatg&&' ) ) 
       AND ( '&&ssdep&&' = '-1' 
              OR ( '&&ssdep&&' <> '-1' 
                   AND ssdep.id LIKE '&&ssdep&&' ) ) 
       AND ( '&&sdept&&' = '-1' 
              OR ( '&&sdept&&' = '-3' 
                   AND sdept.id IS NULL ) 
              OR ( '&&sdept&&' <> '-1' 
                   AND '&&sdept&&' <> '-3' 
                   AND sdept.id LIKE '&&sdept&&' ) ) 
       AND s.transtatus = 1 
       AND s.trandate BETWEEN CONVERT(DATETIME, '&&sfrom&&') - && sdays && +1 
                              AND 
                              '&&sfrom&&' 
        AND ( '&&sproductname&&' = '' 
              OR ( '&&sproductname&&' <> '' 
                   AND ( desc_en LIKE '%&&sproductname&&%' 
                          OR p.id IN (SELECT product_id 
                                      FROM   d_productupc 
                                      WHERE  upc LIKE '%&&sproductname&&%') 
                          OR p.id IN (SELECT product_id 
                                      FROM   d_productupcalt 
                                      WHERE  altupc LIKE '%&&sproductname&&%') ) 
                 ) ) 
       AND ( '&&xhour&&' = '' 
              OR ( '&&xhour&&' <> '' 
                   AND Datepart(hh, d.entrydatetime) = '&&xhour&&' ) ) 
       AND ( '&&sstoreid&&' = '-1' 
              OR ( '&&sstoreid&&' <> '-1' 
                   AND s.storeid = '&&sstoreid&&' ) ) 
GROUP  BY p.id, 
          d.upc, 
          desc_en, 
          xs.tot_ 
UNION 
SELECT 2                                                   linex_, 
       NULL                                                screenhandler, 
       NULL                                                productid, 
       NULL                                                UPC, 
       '<b> --TOTAL--'                                     Product, 
       Count(DISTINCT s.id)                                Sales, 
       Count(DISTINCT wicpan)                              Custs, 
       Sum(finalsaleorreturnamt)                           WICSaleAmt, 
       Sum(finalsaleorreturnamt) - Sum(unitcost * ( CASE 
                                                      WHEN Isnull(netweight, 0) 
                                                           > 0 
                                                    THEN 1.0000 * netweight 
                                                      ELSE 1.0000 * netquantity 
                                                    END )) WICProfitAmt, 
       100.0000 * ( Sum(finalsaleorreturnamt) - Sum(unitcost * ( CASE 
                                 WHEN Isnull(netweight, 0) > 0 
                                            THEN 1.0000 * netweight 
                                 ELSE 1.0000 * netquantity 
                                                                 END )) ) / ( 
       CASE 
         WHEN 
       Sum(finalsaleorreturnamt) <> 0 THEN Sum(finalsaleorreturnamt) 
       ELSE 
       NULL 
       END ) 
                                                           WICProfitMargin, 
       CONVERT(NUMERIC(19, 2), 1.00 * Sum(CASE 
                                            WHEN netweight > 0 THEN netweight 
                                            ELSE netquantity 
                                          END))            WICqty, 
       NULL                                                minunitcost, 
       NULL                                                minunitprice, 
       NULL                                                unitcost, 
       NULL                                                unitprice, 
       NULL                                                maxunitcost, 
       NULL                                                maxunitprice, 
       100                                                 pct_, 
       NULL                                                wicprice 
FROM   s_transummary s WITH (nolock) 
       INNER JOIN s_trandetail d WITH (nolock) 
               ON s.id = d.transummaryid 
                  AND itemstatus IN ( 1, 7, 9 ) 
       LEFT JOIN d_productsn p 
              ON p.id = productid 
       LEFT JOIN d_productcategories sscat 
              ON subcatg_id = sscat.id 
                 AND sscat.catg_level = 4 
       LEFT JOIN d_productcategories scatg 
              ON sscat.catg_parent_id = scatg.id 
                 AND scatg.catg_level = 3 
       LEFT JOIN d_productcategories ssdep 
              ON scatg.catg_parent_id = ssdep.id 
                 AND ssdep.catg_level = 2 
       LEFT JOIN d_productcategories sdept 
              ON ssdep.catg_parent_id = sdept.id 
                 AND sdept.catg_level = 1 
       LEFT JOIN c_employeedeptxref x 
              ON x.username = '&&__ses_username&&' 
                 AND Isnull(deptactive, 'Y') = 'Y' 
                 AND ( ( Isnull(x.scatid, -1) <>- 1 
                         AND x.scatid = sscat.id ) 
                        OR ( Isnull(x.scatid, -1) = -1 
                             AND Isnull(x.catgid, -1) <>- 1 
                             AND x.catgid = scatg.id ) 
                        OR ( Isnull(x.scatid, -1) = -1 
                             AND Isnull(x.catgid, -1) = -1 
                             AND Isnull(x.sdepid, -1) <>- 1 
                             AND x.sdepid = ssdep.id ) 
                        OR ( Isnull(x.scatid, -1) = -1 
                             AND Isnull(x.catgid, -1) = -1 
                             AND Isnull(x.sdepid, -1) = -1 
                             AND Isnull(x.deptid, -1) <>- 1 
                             AND x.deptid = sdept.id ) ) 
WHERE  ( '&&__ses_seclvl&&' = 'A' 
          OR @canseealldepts = 'Y' 
          OR @canseealldepts = 'N' 
             AND NOT x.id IS NULL ) 
       AND ( '&&sscat&&' = '-1' 
              OR ( '&&sscat&&' <> '-1' 
                   AND sscat.id LIKE '&&sscat&&' ) ) 
       AND ( '&&scatg&&' = '-1' 
              OR ( '&&scatg&&' <> '-1' 
                   AND scatg.id LIKE '&&scatg&&' ) ) 
       AND ( '&&ssdep&&' = '-1' 
              OR ( '&&ssdep&&' <> '-1' 
                   AND ssdep.id LIKE '&&ssdep&&' ) ) 
       AND ( '&&sdept&&' = '-1' 
              OR ( '&&sdept&&' = '-3' 
                   AND sdept.id IS NULL ) 
              OR ( '&&sdept&&' <> '-1' 
                   AND '&&sdept&&' <> '-3' 
                   AND sdept.id LIKE '&&sdept&&' ) ) 
        AND ( '&&sproductname&&' = '' 
              OR ( '&&sproductname&&' <> '' 
                   AND ( p.desc_en LIKE '%&&sproductname&&%' 
                          OR p.id IN (SELECT product_id 
                                      FROM   d_productupc 
                                      WHERE  upc LIKE '%&&sproductname&&%') 
                          OR p.id IN (SELECT product_id 
                                      FROM   d_productupcalt 
                                      WHERE  altupc LIKE '%&&sproductname&&%') ) 
                 ) ) 
       AND s.trandate BETWEEN CONVERT(DATETIME, '&&sfrom&&') - && sdays && +1 
                              AND 
                              '&&sfrom&&' 
       AND ( '&&xhour&&' = '' 
              OR ( '&&xhour&&' <> '' 
                   AND Datepart(hh, d.entrydatetime) = '&&xhour&&' ) ) 
       AND ( '&&sstoreid&&' = '-1' 
              OR ( '&&sstoreid&&' <> '-1' 
                   AND s.storeid = '&&sstoreid&&' ) ) 
       AND s.transtatus = 1 
ORDER  BY linex_, 
          && xsort && DESC 