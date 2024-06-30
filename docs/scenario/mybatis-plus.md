---
head:
  - - meta
    - name: keywords
      content: mybatis-plus,springboot

outline: deep
---

# MyBatis-Plus <Badge type="warning" text="3.5.3" />

:::tip 版本选择
`MyBatis-Plus`的版本选择当前最新的<Badge type="warning" text="3.5.3" />。

需要注意的是，不同的版本在配置上存在差异，比如当前版本已经废弃了`mybatis-plus.type-enums-package`字段。
:::

这一节我们将通过一些简单的小需求来阐述`MyBatis-Plus`的强大功能，在此之前，我们假设您已经：

* 拥有 Java 开发环境以及相应 IDE
* 熟悉 Spring Boot
* 熟悉 Maven

## 简述

`MyBatis-Plus`（简称 MP）是一个`MyBatis`的增强工具，在`MyBatis`的基础上只做增强不做改变，为简化开发、提高效率而生。

> 特性：[https://baomidou.com/pages/24112f/#%E7%89%B9%E6%80%A7](https://baomidou.com/pages/24112f/#%E7%89%B9%E6%80%A7)

简单来说，`MyBatis-Plus`就是`MyBatis`的增强工具，它对`MyBatis`
0 .的使用进行了封装，提供了很多开发中常用的功能。而既然是进行了封装，那么底层还是基于`MyBatis`的，所以它也支持`MyBatis`的配置方式。
但这里我们只探讨`MyBatis-Plus`的使用。

## 快速入门

### 引入依赖

在`pom.xml`中引入`MyBatis-Plus`的依赖：

```xml{8-13}
<dependencies>
    ...
    <!--    mysql连接    -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
    <!--    mybatis-plus    -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>${mybatis-plus.version}</version>
    </dependency>
</dependencies>
```

请注意在引入`mybatis-plus-boot-starter`的依赖后，无需再重复引入其他`MyBatis`相关的依赖。
::: tip
`MySQL`的版本不需要填写是因为`SpringBoot`项目进行了依赖的版本管理。详情了解：`spring-boot-dependencies`
模块，里面标明了两百多个常用依赖的版本。
:::

### 数据库建表

为了能使用到一些常用的API，我们可以建立一个含有不同字段类型的表，比如：

```sql
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(50) DEFAULT '' COMMENT '用户姓名',
    `email`      VARCHAR(50) NOT NULL COMMENT '电子邮件地址',
    `password`   CHAR(32)    NOT NULL COMMENT '密码',
    `gender`     TINYINT(1)  DEFAULT 0 COMMENT '性别 0-未知 1-男性 2-女性',
    `is_delete`  TINYINT(1)  DEFAULT 0 COMMENT '是否删除 0-否 1-是',
    `meta`       JSON COMMENT '其他信息',
    `created_at` TIMESTAMP   DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) DEFAULT CHARSET = utf8mb4 COMMENT ='用户表';
```

::: tip
当然这张表对于实际情况并不适用，但是可以作为示例。在这里只是为了了解并使用`MyBatis-Plus`相关的操作。
:::
其对应的测试数据`sql`如下:

```sql
DELETE
FROM user;

INSERT INTO `user`
    (id, name, email, password, gender, is_delete, meta, created_at)
VALUES (1, 'Edgar', 'Miller.56@bol.com.br', 'd58e7495b25781b7ddcfa748e0f9cc01', 0, 0, NULL, '2018-02-03 17:07:23'),
       (2, 'Katie', 'Qualls.04@free.fr', 'd58e7495b25781b7ddcfa748e0f9cc01', 1, 0, NULL, '2023-02-19 17:22:30'),
       (3, 'Summer', 'Linnell.29@yonder.co.uk', 'd58e7495b25781b7ddcfa748e0f9cc01', 2, 0, NULL, '2016-03-10 06:57:59'),
       (4, 'Narcissa', 'Sergeant.08@live.fr', 'd58e7495b25781b7ddcfa748e0f9cc01', 1, 0, NULL, '2022-05-15 10:18:34'),
       (5, 'Donald', 'Truss.48@yahoo.co.jp', 'd58e7495b25781b7ddcfa748e0f9cc01', 1, 1, NULL, '2020-02-07 03:24:00'),
       (6, 'Anderson', 'Bedford.17@gmx.net', 'd58e7495b25781b7ddcfa748e0f9cc01', 0, 0, NULL, '2000-05-13 00:39:45'),
       (7, 'Geoffrey', 'Curren.99@voila.fr', 'd58e7495b25781b7ddcfa748e0f9cc01', 2, 0, NULL, '2017-01-12 11:59:58'),
       (8, 'Tim', 'Harmon.42@yahoo.com.br', 'd58e7495b25781b7ddcfa748e0f9cc01', 2, 0, NULL, '2013-08-11 18:45:31'),
       (9, 'Chandos', 'Heidi.Whyte.36@live.com', 'd58e7495b25781b7ddcfa748e0f9cc01', 0, 1, NULL, '2017-10-21 14:20:03'),
       (10, 'Hero', 'Celia.Devall.06@gmx.de', 'd58e7495b25781b7ddcfa748e0f9cc01', 1, 1, NULL, '2018-08-18 05:51:04');
```

### 开发项目完善

至于最开始的基本代码搭建，有很多的方法可以做，这里不再赘述，大致方法有如下：

* IntelliJ IDEA插件创建（如[`MyBatisX`](https://plugins.jetbrains.com/plugin/10119-mybatisx)
  或[`EasyCode`](https://plugins.jetbrains.com/plugin/10954-easycode)插件等）。
* 使用`MyBatis-Plus`官网介绍的[代码生成器](https://baomidou.com/pages/779a6e/)。
* [万能]手动创建

搭建完基础的项目框架后，就需要进行一系列的配置：

### 配置和常用注解

* 配置`MyBatis-Plus`的`Mapper`接口扫描路径

```java{2}
@SpringBootApplication
@MapperScan("hu.hujix.scenario.mybatisplus.mapper")
public class Scenario2MybatisPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(Scenario2MybatisPlusApplication.class, args);
    }

}
```

这里的`@MapperScan`注解的`value`属性是`Mapper`接口的包路径，同`Mybatis`的配置。

* 配置`MyBatis-Plus`的参数

到此处其实已经可以运行项目使用基本的`CRUD`
功能了，大家可以自行尝试，但是在这里为了方便演示和说明，我们还需要在配置文件中配置`MyBatis-Plus`的一些参数。

```yaml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true # 启动驼峰命名
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 开启控制台日志
```

::: tip
在平常的开发中可能还会指定`XML`文件的地址，但这里只讨论`MyBatis-Plus`的使用。
:::

* 添加映射实体类`user`的相应注解

如下基本的`user`实体类：

```java
public class User extends Model<User> {
    /**
     * 用户id
     */
    private Integer id;
    /**
     * 用户姓名
     */
    private String name;
    //省略
}
```

以下是六个平常项目常用的几个注解，当然`MyBatis-Plus`
还支持更多的注解，详情请看：[`MyBatis-Plus注解`](https://baomidou.com/pages/223848/)

:::details 1. @TableName ：表名注解，标识实体类对应的表

 ```java{1}
 @TableName("user")
 public class User extends Model<User> {
     // 省略
 }
 ```

常用的参数列表如下：
|属性|类型|默认值|描述|
|:---:|:---:|:---:|:---:|
|value|String|""|表名|
|autoResultMap|boolean|false|是否自动构建 resultMap |
|excludeProperty|String[]|{}|需要排除的属性名<Badge type="warning" text="@since 3.3.1" />|
:::

:::details 2. @TableId ：主键注解，标识主键字段

```java{1}
@TableId(type = IdType.AUTO)
private Integer id;
```

关于`type`的值，官网参考如下：
|值|描述|
|:---:|:---:|
|AUTO|数据库ID自增|
|NONE|无状态(注解里等于跟随全局，全局里约等于 INPUT)|
|INPUT|手动输入|
|ASSIGN_ID|分配ID(主键类型为Number(Long和Integer)或String)(since 3.3.0)默认雪花算法。|
|ASSIGN_UUID|分配UUID(主键类型为String)(since 3.3.0)|
:::

:::details 3. @TableField ：字段注解（非主键），标识数据库表的字段

```java{1}
 @TableField("username")
 private String name;
```

简单来说就是，如果实体类的字段名和数据库的不一样，需要使用字段注解来实现正确地映射。
当前注解的常用参数列举：
|属性|类型|默认|描述|
|:---:|:---:|:---:|:---:|
|value|String|""|数据库字段名称|
|exist|boolean|true|是否为数据库表字段|
|update|String|""|字段`update set`部分注入，例如：当在version字段上注解`update="%s+1"`表示更新时会`set version=version+1`|
:::

:::details 4. @EnumValue ：枚举注解，标识枚举字段
要在使用`MyBatis-Plus`的基础上使用枚举自动映射，可以使用当前注解，也可以实现泛型接口`IEnum<T>`来实现，本次的例子就是实现接口来达到目的。
:::

:::details 5. @TableLogic ：逻辑删除注解，标识实体类对应的表是否使用逻辑删除

```java{1}
@TableLogic(value = "0", delval = "1")
private Integer isDelete;
```

|   属性   |   类型   | 必须指定 | 默认值 |   描述   |
|:------:|:------:|:----:|:---:|:------:|
| value  | String |  否   | ""  | 逻辑未删除值 |
| delval | String |  否   | ""  | 逻辑删除值  |

:::

::: details 6. OrderBy ：排序注解，标识实体类对应的表的排序字段
|属性|类型|默认值|描述|
|:---:|:---:|:---:|:---:|
|asc|boolean|true|是否倒序查询|
|sort|short|Short.MAX_VALUE|数字越小越靠前|
:::

## 场景预设

通过上面的一些对常用配置的介绍，下面将进行一些与`MyBatis-Plus`相关的场景来进行配置与使用。

### 场景一：枚举映射

在上面的数据表的设计中，`gender`字段描述性别，是一个枚举的字段，接下来就是如何实现映射。

首先针对该字段在数据库表中会出现的值进行创建枚举类：

```java{9}
@Getter
@AllArgsConstructor
public enum GenderEnum implements IEnum<Integer> {
    UNKNOWN(0, "未知"),
    MALE(1, "男"),
    FEMALE(2, "女");
    
    private final Integer code;
    @JsonValue
    private final String value;

    @Override
    public Integer getValue() {
        return this.code;
    }
}
```

在使用默认`Jackson`的情况下，需要使用`@JsonValue`来进行注明在需要映射的值上，否则对当前枚举类的映射会失效。

实现了`IEnum<T>`类之后，必须重写一个`getValue()`方法，该方法返回的是当前枚举类的值，该值会作为数据库表中的字段值。

修改字段类型：

```java
private GenderEnum gender;
```

通过以上的配置，就可以使查询操作进行自动地映射。

当`UserService`继承了`IService`之后，可以直接在`UserController`中调用简单的查询：

```java{3}
@GetMapping()
public RestResp<List<User>> selectAllUser(){
    return RestResp.build(this.userService.list());
}
```

请求结果示例如下：

```json{7,12,17}
{
  "code": 10200,
  "msg": "ok",
  "data": [
    {
      ...
      "gender": "未知", // [!code focus]
      ...
    },
    {
      ...
      "gender": "男", // [!code focus]
      ...
    },
    {
      ...
      "gender": "女", // [!code focus]
      ...
    },
    ...
  ]
}
```

:::info 字段过滤
在返回的数据中（我省略了），能够看到一些其实我们不想返回给前端的一些数据，比如`password`和`is_delete`。
我们可以在实体类的字段上添加注解`@JsonIgnore`来忽略掉这个字段。
:::

### 场景二：JSON类型映射实体类

在上面的数据表中有一个`meta`字段，在数据库中是`JSON`类型的数据，一般情况下，我们可以直接使用`JSONObject`或者`JSONArray`来表示，
但这里会更详细的使用一个类来进行映射，比如：

```java
@Data
public class MetaData {
    /**
     * IP地址
     */
    private String ip;
    /**
     * 地址
     */
    private String address;
}
```

新建了一个`MetaData`类，添加了一些字段来表示额外的信息，接下来就是如何进行映射，对于实体类的修改如下：

```java{2,9-10}
@Data
@TableName(value = "user", autoResultMap = true) // [!code focus]
@EqualsAndHashCode(callSuper = true)
public class User extends Model<User> {
    ...
    /**
     * 其他信息
     */
    @TableField(typeHandler = JacksonTypeHandler.class) // [!code focus:2]
    private MetaData meta;
    ...
}
```

开启`autoResultMap`和使用`@TableField`注解来指定处理器之后，在`User`实体类中，`meta`字段就会被自动映射成`MetaData`类，

:::warning

* 如果没有开启`autoResultMap`的话，则映射失效。
* 如果没有使用`@TableField`
  指定处理器的话，会出现非法警告：`java.lang.IllegalStateException: No typehandler found for property meta`。
  :::

当做完这些配置之后，重启服务，再次调用接口的结果如下：

```json{8-11,16}
{
    "code": 10200,
    "msg": "ok",
    "data": [
        ...
        {
            ...
            "meta": { // [!code focus:4]
                "ip": "127.0.0.1",
                "address": "北京"
            },
            ...
        },
        {
            ...
            "meta": null, // [!code focus]
            ...
        },
        ...
    ]
}
```

### 场景三：逻辑删除

在数据库中，我们经常需要使用逻辑删除，来避免直接删除数据，因为删除数据之后，就无法恢复。

在`MyBtais-Plus`中，逻辑删除会自动帮我们处理，简单总结如下：

* 在`insert`时不做任何的操作。
* 在`select`和`update`时自动追加一个`where`条件。
* 在`delete`时转变为`update`。

这个变化无需我们修改以前的逻辑：只要配置好了逻辑删除，原先删除的逻辑会被自动替换为更新逻辑，而不需要做任何代码层面的修改。

实现逻辑删除，只需要在实体类中的标识逻辑删除的字段上添加一个`@TableLogic`注解即可，如下：

```java
@TableLogic(value = "0", delval = "1")
private Integer isDelete;
```

在这里显式的指定了逻辑删除的值，当值为`0`时，表示未删除，当值为`1`时，表示删除。也可以不指定，默认就是`0`和`1`。

重启服务，再次调用接口，在控制台的`sql`日志里面就会发现，原先的查询语句中，多了一个`WHERE is_delete = 0`的条件。

### 场景四：使用条件构造器

在`MyBatis-Plus`中，提供了一个条件构造器，可以让我们使用`Lambda`表达式来构造查询条件，比如当现在需要按照性别查询所有的用户时：

```java{3-5}
@Override
public List<User> selectAllUserByGender(String gender) {
    LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(User::getGender, gender); 
    return this.userMapper.selectList(queryWrapper);
}
```

当使用`LambdaQueryWrapper`构造查询条件时，只需要使用`eq`方法，传入`字段名`和`字段值`即可，`MyBatis-Plus`
会自动的将这个构造语句翻译成`sql`语句。

比如上面的`queryWrapper.eq(User::getGender, gender);`会被翻译为`where`条件：`WHERTE gender=#{gender}`。

>编写中...

### 场景五：使用分页插件

到目前，普通地查询已经可以满足我们的需求了，但是当数据量大的时候，我们不可能一次性将所有的数据都查出来，所以`MyBatis-Plus`
提供了一个分页插件，可以让我们很方便地实现分页查询。

使用分页插件需要配置`MybatisPlusInterceptor`，需要手动注册所需的拦截器，代码如下：

```java{8-12}
@Configuration
public class MybatisPlusConfig {

    /**
     * 添加分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

分页功能有关的类是`Page<T>`类，使用自带的分页新建一个最简单的查询接口:

```java{3}
@GetMapping("/page")
public RestResp<Page<User>> selectAllByPage(Page<User> page){
    return RestResp.build(this.userService.page(page,null));  // [!code focus]
}
```
::: details 添加查询条件
```java{3}
@GetMapping("/page")
public RestResp<Page<User>> selectAllByPage(Page<User> page, User user) {
    return RestResp.build(this.userService.page(page, new QueryWrapper<>(user)));
}
```
:::


以下是`Page<T>`类的常用参数：
> 完整参数：[https://baomidou.com/pages/97710a/#page](https://baomidou.com/pages/97710a/#page)

|     属性名     |   类型    |    默认值    | 描述                                                                 |
|:-----------:|:-------:|:---------:|:-------------------------------------------------------------------|
|    size     |  Long   |    10     | 每页显示条数，默认 10                                                       |
|   current   |  Long   |     1     | 当前页                                                                |
|   orders    |  List   | emptyList | 排序字段信息，允许前端传入的时候，注意 SQL 注入问题，可以使用 SqlInjectionUtils.check(...)检查文本 |
| searchCount | boolean |   true    | 是否进行 count 查询，如果只想查询到列表不要查询总记录数，设置该参数为 false                       |
|  maxLimit   |  Long   |           | 单页分页条数限制                                                           |

::: details 数据表查询范围计算
分页的参数最基本的是含有`current`和`size`，而映射到数据库进行过滤查询时会解释为`LIMIT #{start},#{size}`
或者`OFFSET #{start} LIMIT #{size}`。
计算的逻辑如下：

* start = (current - 1) * size
:::
