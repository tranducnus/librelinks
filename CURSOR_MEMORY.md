��#   L i b r e L i n k s   C u r s o r   M e m o r y 
 
 # #   P l a u s i b l e   A n a l y t i c s   v 2   A P I   L e s s o n s 
 
 # # #   A P I   C o n s t r a i n t s   a n d   L i m i t a t i o n s 
 
 1 .   * * S e s s i o n   M e t r i c s   C o n s t r a i n t s * * : 
       -   S e s s i o n   m e t r i c s   l i k e   ` v i e w s _ p e r _ v i s i t `   c a n n o t   b e   u s e d   w i t h   e v e n t   f i l t e r s . 
       -   W o r k a r o u n d :   C a l c u l a t e   t h e s e   m e t r i c s   m a n u a l l y   a f t e r   f e t c h i n g   t h e   b a s e   m e t r i c s . 
       -   E x a m p l e :   ` v i e w s _ p e r _ v i s i t   =   p a g e v i e w s   /   v i s i t s ` 
       -   H a n d l e   d i v i s i o n   b y   z e r o   c a s e s   w i t h   d e f a u l t   v a l u e s . 
 
 2 .   * * R e s p o n s e   P r o c e s s i n g * * : 
       -   A l w a y s   v a l i d a t e   t h e   s t r u c t u r e   o f   A P I   r e s p o n s e s   b e f o r e   p r o c e s s i n g . 
       -   H a n d l e   n u l l   o r   u n d e f i n e d   v a l u e s   g r a c e f u l l y . 
       -   F o r m a t   n u m e r i c   v a l u e s   c o n s i s t e n t l y   ( e . g . ,   u s i n g   ` t o F i x e d ( 2 ) `   f o r   d e c i m a l   v a l u e s ) . 
 
 3 .   * * F a l l b a c k   S t r a t e g i e s * * : 
       -   I m p l e m e n t   d a t a b a s e   f a l l b a c k s   w h e n   A P I   r e t u r n s   n o   d a t a   o r   e r r o r s . 
       -   S e t   m i n i m u m   v a l u e s   f o r   U I   c o n s i s t e n c y   ( e . g . ,   1   v i s i t o r   i n s t e a d   o f   0 ) . 
       -   L o g   d e t a i l e d   e r r o r   i n f o r m a t i o n   f o r   d e b u g g i n g . 
 
 # # #   F i l t e r   S y n t a x   R e q u i r e m e n t s 
 
 1 .   * * C o r r e c t   F i l t e r   S y n t a x * * : 
       -   U s e   ` [ " c o n t a i n s " ,   " e v e n t : p a g e " ,   [ p a t h T o F i l t e r ] ] `   i n s t e a d   o f   ` [ ' i s ' ,   ' e v e n t : p a g e ' ,   [ p a t h T o F i l t e r ] ] ` 
       -   T h e   f i l t e r   o p e r a t o r   m u s t   b e   a   s t r i n g :   ` " c o n t a i n s " `   n o t   j u s t   ` c o n t a i n s ` 
       -   T h e   f i l t e r   f i e l d   m u s t   b e   a   s t r i n g :   ` " e v e n t : p a g e " `   n o t   j u s t   ` e v e n t : p a g e ` 
       -   T h e   f i l t e r   v a l u e   m u s t   b e   a n   a r r a y ,   e v e n   f o r   s i n g l e   v a l u e s :   ` [ p a t h T o F i l t e r ] ` 
 
 2 .   * * R e q u i r e d   P a r a m e t e r s * * : 
       -   A l w a y s   i n c l u d e   ` s i t e _ i d :   p r o c e s s . e n v . N E X T _ P U B L I C _ P L A U S I B L E _ D O M A I N `   i n   a l l   A P I   r e q u e s t s 
       -   S p e c i f y   ` m e t r i c s `   a s   a n   a r r a y   o f   s t r i n g s :   ` [ ' v i s i t o r s ' ,   ' v i s i t s ' ,   ' p a g e v i e w s ' ] ` 
       -   U s e   p r o p e r   ` d a t e _ r a n g e `   f o r m a t   a s   r e t u r n e d   b y   ` f o r m a t T i m e R a n g e V 2 ` 
       -   F o r   t i m e   s e r i e s   d a t a ,   u s e   ` d i m e n s i o n s :   [ ' t i m e : d a y ' ] `   i n s t e a d   o f   j u s t   ` [ ' t i m e ' ] ` 
 
 3 .   * * E r r o r   H a n d l i n g * * : 
       -   H a n d l e   4 0 0   s t a t u s   e r r o r s   s p e c i f i c a l l y   f o r   f i l t e r   s y n t a x   i s s u e s 
       -   L o g   t h e   c o m p l e t e   e r r o r   r e s p o n s e   f o r   d e b u g g i n g 
       -   I m p l e m e n t   f a l l b a c k s   w h e n   f i l t e r   s y n t a x   e r r o r s   o c c u r 
 
 # # #   F r o n t e n d - B a c k e n d   A l i g n m e n t 
 
 1 .   * * D a t a   S t r u c t u r e   C o n s i s t e n c y * * : 
       -   E n s u r e   f r o n t e n d   c o m p o n e n t s   e x p e c t   t h e   s a m e   d a t a   s t r u c t u r e   t h a t   b a c k e n d   A P I s   a r e   r e t u r n i n g 
       -   W h e n   m i g r a t i n g   f r o m   o n e   A P I   v e r s i o n   t o   a n o t h e r ,   c h e c k   a l l   f r o n t e n d   c o m p o n e n t s   t h a t   c o n s u m e   t h e   d a t a 
       -   P a y   s p e c i a l   a t t e n t i o n   t o   n e s t e d   v s .   f l a t   o b j e c t   s t r u c t u r e s 
 
 2 .   * * C o m m o n   M i s a l i g n m e n t s * * : 
       -   P r o p e r t i e s   a c c e s s e d   w i t h   ` . v a l u e `   i n   f r o n t e n d   b u t   r e t u r n e d   a s   d i r e c t   p r o p e r t i e s   i n   A P I 
       -   N e s t e d   o b j e c t s   i n   o l d   A P I   v s .   f l a t   o b j e c t s   i n   n e w   A P I 
       -   D i f f e r e n t   p r o p e r t y   n a m i n g   c o n v e n t i o n s   b e t w e e n   f r o n t e n d   e x p e c t a t i o n s   a n d   A P I   r e s p o n s e s 
 
 3 .   * * T e s t i n g   a n d   V a l i d a t i o n * * : 
       -   L o g   A P I   r e s p o n s e s   i n   t h e   f r o n t e n d   t o   v e r i f y   t h e   s t r u c t u r e   m a t c h e s   c o m p o n e n t   e x p e c t a t i o n s 
       -   I m p l e m e n t   p r o p e r   n u l l / u n d e f i n e d   c h e c k s   i n   c o m p o n e n t s   t o   p r e v e n t   r e n d e r i n g   e r r o r s 
       -   A d d   e x p l i c i t   t y p e   d e f i n i t i o n s   o r   d o c u m e n t a t i o n   f o r   A P I   r e s p o n s e   s t r u c t u r e s 
 
 # # #   C h a r t   R e n d e r i n g   a n d   D a t a   V i s u a l i z a t i o n 
 
 1 .   * * T i m e   S e r i e s   D a t a   R e q u i r e m e n t s * * : 
       -   C h a r t s   r e q u i r e   a t   l e a s t   o n e   d a t a   p o i n t   t o   r e n d e r   p r o p e r l y 
       -   A l w a y s   p r o v i d e   f a l l b a c k   d a t a   w h e n   n o   a c t u a l   t i m e   s e r i e s   d a t a   i s   a v a i l a b l e 
       -   E n s u r e   c o n s i s t e n t   d a t e   f o r m a t t i n g   ( I S O   f o r m a t :   Y Y Y Y - M M - D D )   f o r   p r o p e r   p a r s i n g 
       -   F o r   s i n g l e   d a t a   p o i n t   s c e n a r i o s ,   e x p a n d   t o   m u l t i p l e   p o i n t s   f o r   b e t t e r   v i s u a l i z a t i o n 
 
 2 .   * * C h a r t   V i s i b i l i t y   I m p r o v e m e n t s * * : 
       -   S e t   ` p o i n t R a d i u s `   t o   a   n o n - z e r o   v a l u e   ( e . g . ,   3 - 4 )   t o   m a k e   d a t a   p o i n t s   v i s i b l e ,   e s p e c i a l l y   f o r   s p a r s e   d a t a 
       -   U s e   ` s u g g e s t e d M i n `   a n d   ` s u g g e s t e d M a x `   i n   y - a x i s   s c a l e   o p t i o n s   t o   e n s u r e   s m a l l   v a l u e s   a r e   v i s i b l e 
       -   A d d   p r o p e r   t e n s i o n   ( 0 . 3 - 0 . 4 )   f o r   a e s t h e t i c a l l y   p l e a s i n g   c u r v e s   b e t w e e n   d a t a   p o i n t s 
       -   I n c r e a s e   ` b o r d e r W i d t h `   t o   2 - 3 p x   t o   m a k e   l i n e s   c l e a r l y   v i s i b l e 
       -   F o r   s p a r s e   d a t a   ( 1 - 3   p o i n t s ) ,   s e t   ` t e n s i o n `   t o   0   f o r   b e t t e r   l i n e   r e n d e r i n g 
 
 3 .   * * R e a c t - C h a r t J S - 2   I m p l e m e n t a t i o n * * : 
       -   U s e   ` u s e R e f `   t o   c r e a t e   a   r e f e r e n c e   t o   t h e   c h a r t   i n s t a n c e 
       -   P a s s   t h e   r e f   t o   t h e   L i n e   c o m p o n e n t   f o r   p r o p e r   c h a r t   a c c e s s 
       -   W h e n   u s i n g   C h a r t . j s   v 3 ,   u s e   o n l y   ` t e n s i o n `   p r o p e r t y   ( n o t   t h e   d e p r e c a t e d   ` l i n e T e n s i o n ` ) 
       -   S e t   c h a r t   o p t i o n s   a t   b o t h   t h e   g l o b a l   l e v e l   i n   ` o p t i o n s . e l e m e n t s `   a n d   a t   t h e   d a t a s e t   l e v e l 
       -   F o r   s i n g l e   d a t a   p o i n t s ,   e x p a n d   t o   m u l t i p l e   p o i n t s   w i t h   t h e   s a m e   v a l u e s   f o r   b e t t e r   v i s u a l i z a t i o n 
       -   C o n s i d e r   a d d i n g   h e l p e r   f u n c t i o n s   l i k e   ` e x p a n d S i n g l e D a t a P o i n t `   a n d   ` g e n e r a t e M o c k D a t a `   f o r   t e s t i n g 
 
 4 .   * * D e b u g g i n g   a n d   T e s t i n g * * : 
       -   A d d   c o n s o l e   l o g g i n g   f o r   c h a r t   d a t a   i n   b o t h   b a c k e n d   a n d   f r o n t e n d 
       -   C r e a t e   m o c k   d a t a   f o r   t e s t i n g   c h a r t   r e n d e r i n g   w h e n   r e a l   d a t a   i s   u n a v a i l a b l e 
       -   U s e   t h e   R e a c t   u s e E f f e c t   h o o k   t o   l o g   p r o p s   c h a n g e s   a n d   m o n i t o r   c o m p o n e n t   r e n d e r i n g 
       -   W i t h   s i n g l e   d a t a   p o i n t s ,   t e s t   b o t h   w i t h   a n d   w i t h o u t   l i n e s   t o   s e e   w h a t   r e n d e r s   b e s t 
       -   A d d   d e t a i l e d   p r o p e r t i e s   f o r   p o i n t   s t y l i n g   ( b a c k g r o u n d C o l o r ,   b o r d e r C o l o r ,   e t c . ) 
 
