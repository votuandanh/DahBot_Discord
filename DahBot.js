const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ChannelType, PermissionFlagsBits  } = require('discord.js');

// thêm intents cần thiết
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,              // để bot hoạt động trong server
        GatewayIntentBits.GuildMembers,       // để lắng nghe sự kiện guildMemberAdd
        GatewayIntentBits.GuildMessages,      // để đọc tin nhắn
        GatewayIntentBits.MessageContent      // đọc nội dung tin nhắn
    ],
});

//token bot của t
const TOKEN = 'HEHEHE';

client.on('ready', () => {
    console.log(`Bot đã đăng nhập thành công với tên: ${client.user.tag}`);
});

//1. Module WELCOME
client.on('guildMemberAdd', (member) => {
    // Lấy kênh chào mừng
    const channel = member.guild.channels.cache.find(ch => ch.name === '👋┃welcome');

    if (!channel) return;

    // Gửi tin nhắn chào mừng
    const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setTitle(`Welcome ${member.displayName}!`)
        .setDescription(
            `Chào mừng <@${member.id}> đã đến với **TatDatDah**! 🎉`
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setImage('https://i.pinimg.com/736x/8f/6c/5f/8f6c5ff678045ed74cffe41137c6715f.jpg') //link ảnh
        .setFooter({ text: `Số hộ khẩu hiện tại: ${member.guild.memberCount}` });

    channel.send({ embeds: [embed] });
});

//2. Module VERIFY
client.on('ready', async () => {
    console.log(`✅ Bot đã đăng nhập: ${client.user.tag}`);

    const guild = client.guilds.cache.first(); // lấy sv đầu tiên bot tham gia
    const verifyChannel = guild.channels.cache.find(ch => ch.name === '✅🆅🅴🆁🅸🅵🆈✅');
    if (verifyChannel) {
        const verifyEmbed = new EmbedBuilder()
            .setColor(0xFF0000) // màu đỏ
            .setTitle('TATDATDAH VERIFY')
            .setDescription(
                `Bạn cần nhấn vào nút "Verify now" để tham gia cùng chúng tôi nhé!\n\n` +
                `To gain access to **TATDATDAH**, you need to prove you are a human by completing verification. ` +
                `Click the button below to get started!`
            )
            .setImage('https://m.yodycdn.com/blog/anh-luffy-yody-vn-65.jpg') // link ảnh
            .setFooter({ text: 'TATDATDAH VERIFY SYSTEM', iconURL: 'https://m.yodycdn.com/blog/anh-luffy-yody-vn-65.jpg' }); // ????????

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_button')
                    .setLabel('❤️ Verify now')
                    .setStyle(ButtonStyle.Danger), // màu đỏ
                new ButtonBuilder()
                    .setCustomId('why_button')
                    .setLabel('Why? Đừng hỏi tại sao!!')
                    .setStyle(ButtonStyle.Secondary) // màu xám
                    .setEmoji('💭') // thêm biểu tượng nhẹ
            );

        await verifyChannel.send({ embeds: [verifyEmbed], components: [row] });
    } else {
        console.log('❌ Không tìm thấy kênh xác minh.');
    }
});
//check role VERIFIED
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'verify_button') {
        const role = interaction.guild.roles.cache.find(r => r.name === 'Verified');
        if (!role) {
            return interaction.reply({
                content: '❌ Vai trò "Verified" không tồn tại. Hãy tạo role trước.',
                //ephemeral: true 
                flags: 64
            });
        }

        // Kiểm tra nếu người dùng đã có vai trò "Verified"
        if (interaction.member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: '🚨 Bạn đã xác minh rồi! Không cần nhấn thêm lần nữa.',
                //ephemeral: true 
                flags: 64
            });
        }

        // Gán vai trò "Verified" nếu chưa có
        await interaction.member.roles.add(role);
        await interaction.reply({
            content: '✅ Bạn đã được xác minh thành công! Chào mừng bạn đến với server!',
            //ephemeral: true 
            flags: 64
        });
    }

    if (interaction.customId === 'why_button') {
        return interaction.reply({
            content: 'Hệ thống xác minh giúp bảo vệ server khỏi spam hoặc bot tự động! 😊',
            //ephemeral: true 
            flags: 64
        });
    }
});

//3. Module SEND ANOUNCEMENT
client.on('messageCreate', async (message) => {
    if (message.content === '!notify') {
        const embed = new EmbedBuilder()
            .setColor(0xFF5733)
            .setAuthor({
                name: 'TATDATDAH',
                iconURL: 'https://i.pinimg.com/736x/d9/d4/8a/d9d48a5c2e71022bbe4fe53fc8d2687b.jpg'
            })
            .setTitle('BOT L O Z')
            .setDescription('i need help bot ticket brooooooooo!!!!!!')
            .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQswF1mZ61OTgOSnXgCDRoYPfNjJ8HjHk_iUA&s')
            .setFooter({
                text: 'BOT được phát triển bởi TATDATDAH :)))))) • Hôm nay lúc ' + new Date().toLocaleTimeString(),
                iconURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQswF1mZ61OTgOSnXgCDRoYPfNjJ8HjHk_iUA&s'
            });

        message.channel.send({
            content: '@everyone',
            embeds: [embed],
        });
    }
});

//4. Module create ticket

//Thêm thông báo Ticket
client.on('ready', async () => {
    const guild = client.guilds.cache.first(); // Lấy server đầu tiên bot tham gia
    const ticketChannel = guild.channels.cache.find(ch => ch.name === '📩┃create-ticket'); // Thay 'ticket' bằng tên kênh nơi bạn muốn bot gửi embed
    if (ticketChannel) {
        const ticketEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('TATDATDAH TICKET!')
            .setDescription(
                '📌 **Hướng Dẫn**\n' +
                '- Nhấn vào nút "Create a Ticket" bên dưới nếu bạn cần hỗ trợ.\n\n' +
                '📋 **Vấn đề hỗ trợ**\n' +
                '- Mua hàng, tư vấn, hoặc khắc phục sự cố.\n'
            )
            .setFooter({ text: 'BOT được phát triển bởi TATDATDAH' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create a Ticket')
                    .setStyle(ButtonStyle.Primary) // Nút màu xanh
            );

        await ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
    } else {
        console.log('❌ Không tìm thấy kênh ticket.');
    }
});

// Xử lý nút Ticket
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton() || interaction.customId !== 'create_ticket') return;

    const guild = interaction.guild; // Lấy thông tin server
    const user = interaction.user;  // Lấy thông tin người dùng

    // Kiểm tra guild và user có hợp lệ không
    if (!guild || !user) {
        return interaction.reply({
            content: '❌ Không thể tạo kênh ticket! Guild hoặc User không hợp lệ.',
            //ephemeral: true,
            flags: 64,
        });
    }

    try {
        // Lấy role đội hỗ trợ
        const supportRole = guild.roles.cache.get('1327963318224424992'); // Thay ID này bằng ID đúng của role
        if (!supportRole) {
            return interaction.reply({
                content: '❌ Vai trò đội hỗ trợ không tồn tại.',
                //ephemeral: true,
                flags: 64,
            });
        }

        // Kiểm tra xem kênh của người dùng đã tồn tại chưa
        const existingChannel = guild.channels.cache.find(
            (channel) => channel.name === `ticket-${user.displayName.toLowerCase()}`
        );
        if (existingChannel) {
            return interaction.reply({
                content: `❌ Bạn đã có một kênh hỗ trợ: ${existingChannel}. Vui lòng sử dụng kênh đó.`,
                //ephemeral: true,
                flags: 64,
            });
        }

        // Tạo kênh ticket
        const channel = await guild.channels.create({
            name: `ticket-${user.displayName.toLowerCase()}`, // Tên kênh
            type: ChannelType.GuildText, // text channel
            permissionOverwrites: [
                {
                    id: guild.id, // ID của server
                    deny: [PermissionFlagsBits.ViewChannel], // Ẩn kênh với tất cả mọi người
                },
                {
                    id: user.id, // ID người dùng nhấn nút
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], // Cho phép người dùng xem và gửi tin nhắn
                },
                {
                    id: supportRole.id, // ID của vai trò đội hỗ trợ
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], // Cho phép đội hỗ trợ truy cập
                },
            ],
        });

        // Gửi tin nhắn trong kênh vừa tạo
        await channel.send({
            content: `🎉 Xin chào ${user}, đội hỗ trợ sẽ sớm liên hệ với bạn. Vui lòng mô tả vấn đề của bạn tại đây.`,
        });

        // Phản hồi với người dùng rằng kênh đã được tạo
        await interaction.reply({
            content: `✅ Kênh hỗ trợ của bạn đã được tạo: ${channel}`,
            //ephemeral: true,
            flags: 64,
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: '❌ Đã xảy ra lỗi khi tạo kênh ticket!',
            ephemeral: true,
            //flags: 64,
        });
    }
});

//đăng nhập bot
client.login(TOKEN);
