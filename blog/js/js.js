var source_link = '<p>Материал с сайта журнала "Здоровье": <a href="' + location.href + '">' + location.href + '</a></p>';
var cit = 0;
$(function() {
    if ($('#pager').length) {
        $(window).scroll(function() {
            if ($(document).scrollTop() > $('#pager').parent().offset().top - 100) {
                $('#pager').css({
                    top: ($(document).scrollTop() - $('#pager').parent().offset().top + 100) + 'px'
                });
            } else {
                $('#pager').css({
                    top: '0px'
                });
            }
        });
    }
    if ($('.community-menu').length) {
        cit = $('#community_place').offset().top;
        $('.community-menu').css({
            top: (cit - $(document).scrollTop()) + 'px'
        });
        $(window).scroll(function() {
            if ($(document).scrollTop() < cit) {
                $('.community-menu').css({
                    top: (cit - $(document).scrollTop()) + 'px'
                });
            } else {
                $('.community-menu').css({
                    top: '0'
                });
            }
        });
    }
    $('span.comments').click(function() {
        var tid = $(this).attr('tid');
        if (!tid) return false;
        $('#comments_for_' + tid).html('<img src="/images/ajax-loader.gif" />').show().load('/ajax/comments?tid=' + tid, hook_comments_moderating);
    });
    if (window.getSelection) $('.content').bind('copy', function() {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var magic_div = $('<div>').css({
            overflow: 'hidden',
            width: '1px',
            height: '1px',
            position: 'absolute',
            top: '-10000px',
            left: '-10000px'
        });
        magic_div.append(range.cloneContents(), source_link);
        $('body').append(magic_div);
        var cloned_range = range.cloneRange();
        selection.removeAllRanges();
        var new_range = document.createRange();
        new_range.selectNode(magic_div.get(0));
        selection.addRange(new_range);
        window.setTimeout(function() {
            selection.removeAllRanges();
            selection.addRange(cloned_range);
            magic_div.remove();
        }, 0);
    });
    $('.switch a').click(function() {
        if ($(this).hasClass('active')) return false;
        $(this).parent().children('a.active').removeClass('active');
        $(this).addClass('active');
        return false;
    });
    $('.t-shadow').each(function() {
        $(this).prepend('<span>' + $(this).html() + '</span>');
    });
    Cufon.replace(".bliss, .main-menu > li > a, h1, h2, h3", {
        fontFamily: 'Bliss'
    });
    Cufon.replace(".bliss-l", {
        fontFamily: 'BlissL'
    });
    jQuery('input[placeholder], textarea[placeholder]').placeholder();
    if ($('#slider').length) {
        var sldr = setInterval(sliderRotate, 10000);
        showSlide(0);
    }
    $('#slider #left').click(function() {
        clearInterval(sldr);
        var c = $('#slider div.active');
        var n = c.prev('div.slide');
        if (!n.attr('id')) {
            n = $('#slider div.slide:last');
        }
        var a = n.attr('id').split('_');
        showSlide(a[1]);
        sldr = setInterval(sliderRotate, 10000);
        return false;
    });
    $('#slider #right').click(function() {
        clearInterval(sldr);
        var c = $('#slider div.active');
        var n = c.next('div.slide');
        if (!n.attr('id')) {
            n = $('#slider div.slide:first');
        }
        var a = n.attr('id').split('_');
        showSlide(a[1]);
        sldr = setInterval(sliderRotate, 10000);
        return false;
    });
    $('#switch a').click(function() {
        clearInterval(sldr);
        sldr = setInterval(sliderRotate, 10000);
        if ($(this).hasClass('active')) return false;
        var a = $(this).attr('id').split('_');
        showSlide(a[1]);
        return false;
    });
    $('#gallery').jcarousel();
    if ($('#enc').length) {
        $('.enc .letters a:not(.disabled)').click(function() {
            if ($(this).hasClass('active')) return false;
            $('.enc .letters a.active').removeClass('active');
            $(this).addClass('active');
            $('#enc').html('Загрузка ...').load('/ajax/enc', {
                letter: $(this).text()
            }, function() {
                Cufon.replace("#enc a", {
                    fontFamily: 'BlissL'
                })
            });
            return false;
        });
        $('.enc .letters .current').trigger('click');
    }
    bind_poll_more();
    $('.poll a.close').hide();
    $('#infogfx').click(function() {
        var h = parseInt($('#infogfx .picture img').css('height')) - parseInt($('#infogfx .picture').css('height'));
        $('#infogfx .picture').animate({
            height: h + 'px'
        });
        return false;
    });
    $('#shadow2').height($(document).height());
    $('.modal .title img').click(closeModal);
    $('a.login').click(function() {
        showModal($('#form-login'), $(this), 350, 240);
        return false;
    });
    $('#form-login form').submit(function() {
        $('#form-login .error').removeClass('error');
        $('#form-login input').each(function() {
            if (!$(this).val()) $(this).addClass('error');
        });
        if ($('#form-login .error').length) return false;
        $("#busy-login").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/login',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#busy-login").addClass('error').html(data.message);
                    $('#form-login form').show();
                } else {
                    location.reload();
                }
            }
        });
        return false;
    });
    $('a.recover').click(function() {
        showModal($('#form-recover'), $(this), 350, 130);
        return false;
    });
    $('#form-recover form').submit(function() {
        $('#form-recover .error').removeClass('error');
        $('#form-recover input').each(function() {
            if (!$(this).val()) $(this).addClass('error');
        });
        if ($('#form-recover .error').length) return false;
        if (!isEmail($('#email2').val())) {
            $('#email2').addClass('error');
            $("#busy-recover").addClass('error').html('Введите свой настоящий e-mail').show();
            return false;
        }
        $("#busy-recover").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/recover',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#busy-recover").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#form-recover form').show();
                } else {
                    $("#busy-recover").removeClass('error').html('Вам выслано письмо с новым паролем.').show();
                }
            }
        });
        return false;
    });
    $('a.register').click(function() {
        showModal($('#form-register'), $(this), 350, 390);
        return false;
    });
    $('#form-register form').submit(function() {
        $('#form-register .error').removeClass('error');
        $('#form-register input').each(function() {
            if (!$(this).val()) $(this).addClass('error');
        });
        if ($('#form-register .error').length) return false;
        if (!$('#agree:checked').length) {
            $("#busy-register").addClass('error').html('Вы должны принять "Соглашение об использовании"').show();
            return false;
        }
        if ($('#p1').val() != $('#p2').val()) {
            $('#p1, #p2').addClass('error');
            $("#busy-register").addClass('error').html('Пароли не совпадают').show();
            return false;
        }
        if (!isEmail($('#email').val())) {
            $('#email').addClass('error');
            $("#busy-register").addClass('error').html('Введите свой настоящий e-mail').show();
            return false;
        }
        $("#busy-register").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/register',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#busy-register").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#form-register form').show();
                } else {
                    $("#busy-register").removeClass('error').html('Регистрация прошла успешно. Вам выслано письмо с инструкциями по активации учетной записи.').show();
                }
            }
        });
        return false;
    });
    hook_comments_moderating();
    hook_expert();
    $('#form-question form').submit(function() {
        $('#form-question .error').removeClass('error');
        $(this).children('input, textarea').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
            }
        });
        if ($('#form-question form .error').length) {
            return false;
        }
        $("#busy-question").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/question',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#busy-question").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#form-question form').show();
                } else {
                    $("#busy-question").removeClass('error').html('Спасибо за вопрос').show();
                }
            }
        });
        return false;
    });
    $('a.add-friend').click(function() {
        $(this).html('<img src="/images/ajax-small.gif" />');
        $.ajax({
            url: '/ajax/add-friend',
            data: {
                'user': $(this).attr('data-user')
            },
            success: function(data) {
                $('a.add-friend').html('Отправлен запрос на добавление в друзья');
            }
        });
        return false;
    });
    $('a.friend-accept, a.friend-deny, a.friend-remove').click(function() {
        var elm = $(this).parent('p');
        elm.html('<img src="/images/ajax-small.gif" />');
        $.ajax({
            url: '/ajax/' + $(this).attr('class'),
            data: {
                'user': $(this).attr('data-user')
            },
            success: function(data) {
                elm.html(data);
            }
        });
        return false;
    });
    $('a.queue').click(function() {
        $('#form-queue .title span').html($(this).attr('data-title'));
        showModal($('#form-queue'), $(this), 400, 270);
        if ($('#qexpert')) $('#qexpert').val($(this).attr('data-expert'));
        return false;
    });
    $('#form-queue form').submit(function() {
        $('#form-queue .error').removeClass('error');
        $(this).children('input, textarea').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
            }
        });
        if ($('#form-queue form .error').length) {
            return false;
        }
        $("#busy-queue").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/queue',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#busy-queue").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#form-queue form').show();
                } else {
                    $("#busy-queue").removeClass('error').html('Спасибо.').show();
                }
            }
        });
        return false;
    });
    $('a.m_question').click(function() {
        $('#form-m_question .title span').html($(this).attr('title'));
        showModal($('#form-m_question'), $(this), 400, 270);
        if ($('#moderator')) $('#moderator').val($(this).attr('data-moderator'));
        return false;
    });
    $('#form-m_question form').submit(function() {
        $('#form-m_question .error').removeClass('error');
        $(this).children('input, textarea').each(function() {
            if (!$(this).val()) {
                $(this).addClass('error');
            }
        });
        if ($('#form-m_question form .error').length) {
            return false;
        }
        $("#busy-m_question").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/m_question',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#busy-m_question").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#form-m_question form').show();
                } else {
                    $("#busy-m_question").removeClass('error').html('Спасибо за вопрос').show();
                }
            }
        });
        return false;
    });
    var ck = false;
    $('#blogpost .title img').click(function() {
        $('#blogpost').hide();
    });
    $('a.blog-post').click(function() {
        $('#blogpost').show().css({
            'width': 800,
            'height': 600,
            'left': parseInt(($(document).width() - 800) / 2),
            'top': parseInt($(document).scrollTop() + ($(window).height() - 500) / 2)
        });
        if (!ck) {
            CKEDITOR.replace('cktext', {
                toolbar: [
                    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyFull'],
                    ['Link', 'Unlink', 'Anchor'],
                    ['Format', 'TextColor'],
                    ['UploadImage'],
                    ['Maximize']
                ],
                extraPlugins: 'upload_image',
                resize_enabled: false
            });
            ck = true;
        }
        return false;
    });
    $('#blogpost form').submit(function() {
        $('#blogpost .error').removeClass('error');
        $('#blogpost .req').each(function() {
            if (!$(this).val()) $(this).addClass('error');
        });
        if ($('#blogpost .error').length) return false;
        $("#blogpost .busy").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        $.ajax({
            type: 'POST',
            url: '/ajax/blogpost',
            dataType: 'json',
            data: $(this).serializeArray(),
            success: function(data) {
                if (!data.success) {
                    $("#blogpost .busy").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#blogpost form').show();
                } else {
                    $("#blogpost .busy").removeClass('error').html('Запись опубликована').show();
                }
            }
        });
        return false;
    });
    $('#poll_check').on('change', function() {
        if ($(this).attr('checked'))
            $('#poll_name, #poll_answers').show().addClass('req');
        else $('#poll_name, #poll_answers').hide().removeClass('req');
    });
    advice_hook();
    $('.contest #add_feed').click(function() {
        $(this).hide();
        $('.contest #add').show();
    });
    $('.contest #add form').submit(function() {
        $('#add .error').removeClass('error');
        $('#add .req').each(function() {
            if (!$(this).val()) $(this).addClass('error');
        });
        if ($('#add .error').length) return false;
        $("#busy").show().html('<img src="/images/ajax-loader.gif" />');
        $(this).hide();
        var options = {
            success: function(data) {
                if (!data.success) {
                    $("#busy").addClass('error').html(data.message);
                    if (data.field) $('#' + data.field).addClass('error');
                    $('#add form').show();
                } else {
                    $("#busy").removeClass('error').html('Спасибо, Ваша запись опубликована.').show();
                }
            },
            url: '/ajax/contest',
            dataType: 'json'
        };
        $(this).ajaxSubmit(options);
        return false;
    });
    $('.rate a.contest_delete').click(function() {
        if (!confirm('Вы уверены?')) return false;
        $(this).html('<img src="/images/ajax-small.gif" />');
        $.ajax({
            url: '/ajax/contest_delete?id=' + $(this).attr('cid'),
            success: function(data) {
                document.location.reload();
            }
        });
        return false;
    });
    $('.contest .rating .icon-up').click(function() {
        $('#rating').html('<img src="/images/ajax-small.gif" />').load('/ajax/rating-up', {
            feed: $('#rating').attr('feed-id')
        });
        return false;
    });
    $('.contest .rating .icon-down').click(function() {
        $('#rating').html('<img src="/images/ajax-small.gif" />').load('/ajax/rating-down', {
            feed: $('#rating').attr('feed-id')
        });
        return false;
    });
    if ($('#welcome_content').html()) {
        $('#shadow').fadeTo(0, 0.8);
        $(window).bind('scroll', fixShadow).bind('resize', fixShadow);
        $('#shadow').click(hideWelcome);
        $('#skip').click(hideWelcome);
        $('#welcome_container').show();
        fixShadow();
        var hide = 60;
        if (!isNaN(hide) && hide) setTimeout('hideWelcome()', hide * 1000);
    }
    hook_my_categories();
});

function hook_my_categories() {
    $('a.category_add, a.category_remove').unbind('click', category_action)
    $('a.category_add, a.category_remove').click(category_action);
}

function category_action() {
    $(this).children('img').attr('src', '/images/ajax-small.gif');
    var t = $(this);
    $.ajax({
        type: 'POST',
        url: '/ajax/' + $(this).attr('class'),
        data: {
            cid: +$(this).attr('cid')
        },
        success: function(data) {
            t.replaceWith(data);
            hook_my_categories();
            $('.hint').fadeOut(3000);
        }
    });
    return false;
}

function hook_expert() {
    $('a.ask').click(function() {
        $('#form-question .title span').html($(this).attr('data-title'));
        showModal($('#form-question'), $(this), 400, 270);
        if ($('#expert')) $('#expert').val($(this).attr('data-expert'));
        return false;
    });
}

function add_favotite(id, url, table, name) {
    $('#fav_' + id).html('<img src="/images/ajax-small.gif" />');
    $.ajax({
        type: 'POST',
        url: '/ajax/favorite',
        data: {
            id: id,
            url: url,
            table: table,
            name: name
        },
        success: function(data) {
            $('#fav_' + id).replaceWith('<span>Материал добавлен в <a href="/personal/favorites">"Мое избранное"</a></span>');
        }
    });
    return false;
}

function advice_hook() {
    $('#cite_next').click(function() {
        $("#advice").html('Загрузка ...').load('/ajax/advice', {
            id: $(this).attr('advice')
        }, advice_hook);
        return false;
    });
    $('#advice_next').click(function() {
        $("#advice").html('Загрузка ...').load($(this).attr('href'), {
            id: $(this).attr('advice')
        }, advice_hook);
        return false;
    });
    $('#science_next').click(function() {
        $("#science").html('Загрузка ...').load('/ajax/science', {
            id: $(this).attr('advice')
        }, advice_hook);
        return false;
    });
}

function isEmail(email) {
    var reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return email.match(reg);
}

function showSlide(n) {
    $('#slider div.active').removeClass('active').fadeOut('slow');
    $('#slider a.active').removeClass('active');
    $('#switch_' + n).addClass('active');
    $('#slide_' + n).addClass('active').fadeIn('slow');
}

function sliderRotate() {
    var c = $('#slider div.active');
    var n = c.next('div.slide');
    if (!n.attr('id')) {
        n = $('#slider div:first');
    }
    var a = n.attr('id').split('_');
    showSlide(a[1]);
}

function bind_poll_more() {
    if ($('form#poll')) {
        $('form#poll').submit(function() {
            v = $('form#poll').serialize()
            $('form#poll').html('<img src="/images/ajax-loader.gif" />').load('/ajax/poll?a=' + $('#another2').length + '&' + v, bind_poll_more);
            $('.poll').removeClass('poll-active');
            return false;
        });
    }
    $('a.pollmore').click(function() {
        $(this).hide();
        $('.poll').addClass('poll-active');
        $('.poll div.more').slideDown();
        $('.poll a.close').show();
        return false;
    });
    $('.poll a.close').click(function() {
        $(this).hide();
        $('.poll div.more').slideUp('fast', function() {
            $('.poll').removeClass('poll-active');
        });
        $('a.pollmore').show();
        return false;
    });
    $('#another').click(function() {
        $('#poll-container').html('<img src="/images/ajax-loader.gif" />').load('/ajax/get_poll?poll=' + $(this).attr('href'), bind_poll_more);
        return false;
    });
    $('#another2').click(function() {
        $('#poll-container').html('<img src="/images/ajax-loader.gif" />').load('/ajax/get_poll2?poll=' + $(this).attr('href'), bind_poll_more);
        return false;
    });
}
var active_modal = false;

function showModal(wnd, src, width, height, fast) {
    $('body').append(wnd);
    if (active_modal) active_modal.wnd.removeClass('modal-active');
    if (!$('#shadow2').is(':visible')) $('#shadow2').fadeIn();
    if (src) {
        wnd.css({
            'width': src.width(),
            'height': src.height(),
            'left': src.offset().left,
            'top': src.offset().top
        });
    } else {
        wnd.css({
            'width': 0,
            'height': 0,
            'left': 0,
            'top': 0
        });
    }
    wnd.addClass('modal-active');
    wnd.css({
        'width': width,
        'height': height,
        'left': parseInt(($(document).width() - width) / 2),
        'top': parseInt($(document).scrollTop() + ($(window).height() - height) / 2)
    });
    active_modal = {
        wnd: wnd,
        src: src
    };
}

function closeModal() {
    if (!active_modal) return false;
    $('#shadow2').fadeOut();
    if (active_modal.src)
        active_modal.wnd.css({
            'width': active_modal.src.width(),
            'height': active_modal.src.height(),
            'left': active_modal.src.offset().left,
            'top': active_modal.src.offset().top
        });
    setTimeout(function() {
        $('.modal-active').removeClass('modal-active');
    }, 500);
    active_modal = false;
}

function fixShadow() {
    $('#shadow').css({
        width: $(window).width() + $(document).scrollLeft() + 'px',
        height: $(window).height() + $(document).scrollTop() + 'px'
    });
    $('#welcome').css({
        left: parseInt(($(window).width() - $('#welcome').width()) / 2) + 'px',
        top: $(document).scrollTop() + parseInt(($(window).height() - $('#welcome').height()) / 2) + 'px'
    });
}

function hideWelcome() {
    $('#welcome_container').hide();
    $(window).unbind('scroll', fixShadow).unbind('resize', fixShadow);
}
var saved_content = [];

function cancel_edit(id) {
    if (!$('#text' + id)) return;
    $('#text' + id).html(saved_content[id]);
}

function save_edit(id) {
    var text = $('#texte' + id).val();
    $('#text' + id).html('<img src="/images/ajax-loader.gif" />');
    $.ajax({
        type: 'POST',
        url: '/ajax/comment_edit',
        data: {
            id: id,
            text: text
        },
        success: function(data) {
            $('#text' + id).html(data);
        }
    });
}

function hook_comments_moderating() {
    $('.comment-list .rate a.edit').click(function() {
        var id = $(this).attr('cid');
        saved_content[id] = $('#text' + id).html();
        $('#text' + id).html('<textarea class="edit" id="texte' + id + '"></textarea><input type="button" class="edit" value="Сохранить" onclick="save_edit(' + id + ')" /><input type="button" class="edit" value="Отмена" onclick="cancel_edit(' + id + ')" />');
        $('#texte' + id).val(saved_content[id]);
        return false;
    });
    $('.comment-list .rate a.delete').click(function() {
        if (!confirm('Вы уверены?')) return false;
        var comments_place = '#comments';
        if ($(this).parents('.comment-list').attr('tid')) comments_place += '_' + $(this).parents('.comment-list').attr('tid');
        $(comments_place).html('<p align="center"><img src="/images/ajax-loader.gif" /></p>').load('/ajax/comment-delete', {
            cid: $(this).attr('cid')
        }, hook_comments_moderating);
        return false;
    });
    $('.comment-list .rate a.delete_ban').click(function() {
        if (!confirm('Вы уверены?')) return false;
        var comments_place = '#comments';
        if ($(this).parents('.comment-list').attr('tid')) comments_place += '_' + $(this).parents('.comment-list').attr('tid');
        $(comments_place).html('<p align="center"><img src="/images/ajax-loader.gif" /></p>').load('/ajax/comment-delete-ban', {
            cid: $(this).attr('cid')
        }, hook_comments_moderating);
        return false;
    });
    $('.comment-list .rate a.icon-up, .comments .rate a.icon-down').click(function() {
        $(this).html('<img src="/images/ajax-small.gif" />').load('/ajax/comment-rating', {
            mode: $(this).hasClass('icon-up'),
            cid: $(this).attr('cid')
        });
        return false;
    });
    $('.gallery .rating a.icon-up, .gallery .rating a.icon-down').click(function() {
        $(this).html('<img src="/images/ajax-small.gif" />').load('/ajax/photo-rating', {
            mode: $(this).hasClass('icon-up'),
            cid: $(this).attr('cid')
        });
        return false;
    });
    $('.personal .gallery .rate a.icon-up, .personal .gallery .rate a.icon-down').click(function() {
        $('#rating').html('<img src="/images/ajax-small.gif" />').load('/ajax/user-photo-rating', {
            mode: $(this).hasClass('icon-up'),
            cid: $('#rating').attr('cid')
        });
        return false;
    });
    $('.comment-list .reply').click(function() {
        $(this).parents('.comments').children('form').children('.comment_parent').val($(this).attr('reply'));
        $(this).parents('.comments').children('form').children('.reply_user').text('Ваш ответ ' + $(this).attr('reply_user') + ':');
    });
    $('.comment_parent').val(0);
    $('.reply_user').text('');
    $('form.comment').unbind('submit', submit_comment);
    $('form.comment').submit(submit_comment);
    $('a.subscribe, a.unsubscribe').unbind('submit', subscribe_comment);
    $('a.subscribe, a.unsubscribe').click(subscribe_comment);
}

function subscribe_comment() {
    if (!$(this).attr('tid')) return false;
    $(this).html('<img src="/images/ajax-small.gif" />').load('/ajax/comments_' + $(this).attr('class') + '?tid=' + $(this).attr('tid'));
    return false;
}

function submit_comment() {
    if (!$(this).children('textarea').val()) {
        $(this).children('textarea').addClass('error');
        return false;
    }
    $(this).children('textarea').removeClass('error');
    var comments_place = '#comments';
    if ($(this).attr('tid')) comments_place += '_' + $(this).attr('tid');
    $(comments_place).html('<p align="center"><img src="/images/ajax-loader.gif" /></p>');
    $.ajax({
        type: 'POST',
        url: '/ajax/comment',
        data: $(this).serializeArray(),
        success: function(data) {
            $('.comments textarea').val('');
            $(comments_place).html(data);
            hook_comments_moderating();
        }
    });
    return false;
}

function CreateBookmarkLink() {
    title = "Журнал Здоровье";
    url = "";
    if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    } else if (window.external) {
        window.external.AddFavorite(url, title);
    } else if (window.opera && window.print) {
        return true;
    }
}

function fix_fonts() {
    Cufon.replace(".bliss, h1, h2, h3", {
        fontFamily: 'Bliss'
    });
}
