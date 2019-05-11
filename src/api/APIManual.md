##一些提示
以下所有的API都有两种方式可调用 
http://api?key=value&key2=value2 
以及 
http://api/key/value/key2/value

同时所有的API调用都应该有一个appid跟在最后 
User-Agent必须为HavfunClient-平台

##主系统信息
关于一些主系统的API
###1.获取板块列表
/Api/getForumList

- id: 板块组ID
- name: 板块组名称
- 