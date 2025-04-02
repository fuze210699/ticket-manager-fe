import { createI18n } from 'vue-i18n';

const messages = {
  vi: {
    common: {
      close: 'Đóng',
      save: 'Lưu',
      addNew: 'Thêm mới...',
      expand: 'Mở rộng',
      collapse: 'Thu gọn',
      language: 'Ngôn ngữ',
      vietnamese: 'Tiếng Việt',
      english: 'English',
      japanese: '日本語',
      back: 'Quay lại',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      success: 'Thành công',
      confirm: 'Xác nhận',
      allRightsReserved: "Bản quyền được bảo vệ",
      privacyPolicy: "Chính sách bảo mật",
      termsOfService: "Điều khoản sử dụng",
      learnMore: 'Tìm hiểu thêm',
      getStarted: 'Bắt đầu ngay',
    },
    workspace: {
      namePlaceholder: 'Nhập tên workspace...',
      descriptionPlaceholder: 'Nhập mô tả không gian làm việc...',
      tickets: 'Danh sách ticket',
      noTickets: 'Chưa có ticket nào. Nhấn nút "Thêm Ticket" để tạo mới.'
    },
    ticket: {
      add: 'Thêm Ticket',
      code: 'Mã ticket',
      title: 'Tiêu đề',
      link: 'Link',
      milestone: 'Milestone',
      status: 'Trạng thái',
      estimateTime: 'Thời gian ước tính (giờ)',
      actualTime: 'Thời gian thực tế (giờ)',
      startTime: 'Thời gian bắt đầu',
      endTime: 'Thời gian kết thúc',
      statuses: {
        todo: 'To Do',
        inProgress: 'In Progress',
        done: 'Done'
      },
      name: 'Tên ticket',
      description: 'Mô tả',
      assignee: 'Người thực hiện',
      priority: 'Độ ưu tiên',
      dueDate: 'Ngày hết hạn',
      save: 'Lưu',
      details: 'Chi tiết ticket'
    },
    milestone: {
      add: 'Thêm Milestone',
      title: 'Tiêu đề',
      startTime: 'Thời gian bắt đầu',
      endTime: 'Thời gian kết thúc',
      description: 'Mô tả',
      placeholder: {
        title: 'Nhập tiêu đề milestone...',
        description: 'Nhập mô tả milestone...'
      },
      name: 'Tên milestone',
      dueDate: 'Ngày hết hạn',
      save: 'Lưu',
      cancel: 'Hủy'
    },
    dependency: {
      add: 'Thêm Phụ thuộc',
      type: 'Loại phụ thuộc',
      description: 'Mô tả',
      confirm: 'Xác nhận phụ thuộc',
      types: {
        hard: 'Cứng',
        soft: 'Mềm'
      },
      note: 'Ghi chú (tùy chọn)',
      save: 'Lưu',
      cancel: 'Hủy'
    },
    footer: {
      appName: 'Ticket Manager',
      allRightsReserved: 'Bản quyền được bảo vệ',
      privacyPolicy: 'Chính sách bảo mật',
      termsOfService: 'Điều khoản sử dụng'
    },
    landing: {
      title: 'Quản lý Ticket Thông minh',
      description: 'Giải pháp quản lý ticket hiệu quả với giao diện trực quan và dễ sử dụng. Tối ưu hóa quy trình làm việc của bạn với các tính năng mạnh mẽ.',
      getStarted: 'Bắt đầu ngay',
      benefits: {
        time: {
          title: 'Tiết kiệm thời gian',
          description: 'Tự động hóa các tác vụ lặp lại và quản lý ticket hiệu quả'
        },
        accuracy: {
          title: 'Chính xác cao',
          description: 'Theo dõi tiến độ và trạng thái ticket một cách chính xác'
        },
        collaboration: {
          title: 'Cộng tác dễ dàng',
          description: 'Làm việc nhóm hiệu quả với các tính năng chia sẻ và thông báo'
        }
      },
    },
    login: {
      title: 'Đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      rememberMe: 'Ghi nhớ đăng nhập',
      forgotPassword: 'Quên mật khẩu?',
      signIn: 'Đăng nhập',
      noAccount: 'Chưa có tài khoản?',
      register: 'Đăng ký ngay'
    },
    home: {
      title: 'Không gian làm việc',
      subtitle: 'Quản lý và tổ chức công việc của bạn',
      createWorkspace: 'Tạo không gian mới',
      members: 'thành viên',
      openWorkspace: 'Mở không gian',
      createWorkspaceTitle: 'Tạo không gian làm việc mới',
      workspaceName: 'Tên không gian',
      workspaceDescription: 'Mô tả',
      create: 'Tạo',
      noWorkspaces: 'Chưa có không gian làm việc nào. Tạo một không gian mới để bắt đầu.',
      noWorkspacesTitle: 'Chưa có không gian làm việc'
    },
    register: {
      title: 'Đăng ký tài khoản',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      createAccount: 'Tạo tài khoản',
      haveAccount: 'Đã có tài khoản?',
      signIn: 'Đăng nhập'
    },
    nav: {
      dashboard: 'Bảng điều khiển',
      projects: 'Dự án',
      tasks: 'Công việc',
      reports: 'Báo cáo',
      guide: 'Hướng dẫn',
      profile: 'Hồ sơ',
      settings: 'Cài đặt',
      logout: 'Đăng xuất'
    },
    guide: {
      title: 'Hướng dẫn sử dụng',
      subtitle: 'Tìm hiểu cách sử dụng Ticket Manager hiệu quả',
      gettingStarted: 'Bắt đầu',
      features: 'Tính năng',
      tutorials: 'Hướng dẫn',
      faq: 'Câu hỏi thường gặp',
      contact: 'Liên hệ hỗ trợ'
    },
    profile: {
      title: 'Hồ sơ cá nhân',
      changeAvatar: 'Thay đổi ảnh đại diện',
      avatarDescription: 'Tải lên ảnh đại diện mới',
      personalInfo: 'Thông tin cá nhân',
      fullName: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      location: 'Địa chỉ',
      bio: 'Giới thiệu',
      saveChanges: 'Lưu thay đổi',
      uploadButton: 'Tải lên ảnh',
      bioPlaceholder: 'Hãy kể một chút về bản thân...',
      bioDescription: 'Mô tả ngắn gọn về bản thân',
      saving: 'Đang lưu...',
      saved: 'Đã lưu',
      saveSuccess: 'Hồ sơ của bạn đã được cập nhật thành công',
      saveError: 'Lưu thất bại',
      saveErrorDescription: 'Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại.',
      invalidFileType: 'Loại tệp không hợp lệ',
      pleaseSelectImage: 'Vui lòng chọn một tệp ảnh',
      fileTooLarge: 'Tệp quá lớn',
      maxFileSize: 'Kích thước tệp tối đa là 5MB',
      avatarUploaded: 'Đã tải lên ảnh đại diện',
      avatarUploadSuccess: 'Ảnh đại diện của bạn đã được cập nhật',
      uploadError: 'Tải lên thất bại',
      uploadErrorDescription: 'Có lỗi xảy ra khi tải lên ảnh đại diện. Vui lòng thử lại.'
    },
    settings: {
      title: 'Cài đặt',
      accountSettings: 'Cài đặt tài khoản',
      currentPassword: 'Mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      confirmPassword: 'Xác nhận mật khẩu mới',
      notificationSettings: 'Cài đặt thông báo',
      emailNotifications: 'Thông báo qua email',
      emailNotificationsDescription: 'Nhận thông báo về các cập nhật và thay đổi qua email',
      pushNotifications: 'Thông báo đẩy',
      pushNotificationsDescription: 'Nhận thông báo trực tiếp trên trình duyệt',
      saveChanges: 'Lưu thay đổi',
      saveSuccess: 'Đã lưu cài đặt thành công',
      saveError: 'Lỗi khi lưu cài đặt',
      saveErrorDescription: 'Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.',
      passwordMismatch: 'Mật khẩu mới không khớp',
      invalidCurrentPassword: 'Mật khẩu hiện tại không chính xác',
      passwordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
      passwordRequirements: 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số'
    },
  },
  en: {
    common: {
      close: 'Close',
      save: 'Save',
      addNew: 'Add new...',
      expand: 'Expand',
      collapse: 'Collapse',
      language: 'Language',
      vietnamese: 'Vietnamese',
      english: 'English',
      japanese: 'Japanese',
      back: 'Back',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      confirm: 'Confirm',
      allRightsReserved: "All rights reserved",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    workspace: {
      namePlaceholder: 'Enter workspace name...',
      descriptionPlaceholder: 'Enter workspace description...',
      tickets: 'Tickets',
      noTickets: 'No tickets yet. Click "Add Ticket" to create one.'
    },
    ticket: {
      add: 'Add Ticket',
      code: 'Ticket code',
      title: 'Title',
      link: 'Link',
      milestone: 'Milestone',
      status: 'Status',
      estimateTime: 'Estimated time (hours)',
      actualTime: 'Actual time (hours)',
      startTime: 'Start time',
      endTime: 'End time',
      statuses: {
        todo: 'To Do',
        inProgress: 'In Progress',
        done: 'Done'
      },
      name: 'Ticket name',
      description: 'Description',
      assignee: 'Assignee',
      priority: 'Priority',
      dueDate: 'Due date',
      save: 'Save',
      details: 'Ticket details'
    },
    milestone: {
      add: 'Add Milestone',
      title: 'Title',
      startTime: 'Start time',
      endTime: 'End time',
      description: 'Description',
      placeholder: {
        title: 'Enter milestone title...',
        description: 'Enter milestone description...'
      },
      name: 'Milestone name',
      dueDate: 'Due date',
      save: 'Save',
      cancel: 'Cancel'
    },
    dependency: {
      add: 'Add Dependency',
      type: 'Dependency type',
      description: 'Description',
      confirm: 'Confirm Dependency',
      types: {
        hard: 'Hard',
        soft: 'Soft'
      },
      note: 'Note (Optional)',
      save: 'Save',
      cancel: 'Cancel'
    },
    footer: {
      appName: 'Ticket Manager',
      allRightsReserved: 'All rights reserved',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service'
    },
    landing: {
      title: 'Smart Ticket Management',
      description: 'Efficient ticket management solution with intuitive and user-friendly interface. Optimize your workflow with powerful features.',
      getStarted: 'Get Started',
      benefits: {
        time: {
          title: 'Save Time',
          description: 'Automate repetitive tasks and manage tickets efficiently'
        },
        accuracy: {
          title: 'High Accuracy',
          description: 'Track ticket progress and status with precision'
        },
        collaboration: {
          title: 'Easy Collaboration',
          description: 'Work effectively as a team with sharing and notification features'
        }
      }
    },
    login: {
      title: 'Sign in',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign in',
      noAccount: 'Don\'t have an account?',
      register: 'Register now'
    },
    home: {
      title: 'Workspaces',
      subtitle: 'Manage and organize your work',
      createWorkspace: 'Create new workspace',
      members: 'members',
      openWorkspace: 'Open workspace',
      createWorkspaceTitle: 'Create new workspace',
      workspaceName: 'Workspace name',
      workspaceDescription: 'Description',
      create: 'Create',
      noWorkspaces: 'No workspaces yet. Create a new workspace to get started.',
      noWorkspacesTitle: 'No workspaces'
    },
    register: {
      title: 'Create an account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      createAccount: 'Create account',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in'
    },
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      reports: 'Reports',
      guide: 'Guide',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout'
    },
    guide: {
      title: 'User Guide',
      subtitle: 'Learn how to use Ticket Manager effectively',
      gettingStarted: 'Getting Started',
      features: 'Features',
      tutorials: 'Tutorials',
      faq: 'FAQ',
      contact: 'Contact Support'
    },
    profile: {
      title: 'Personal Profile',
      changeAvatar: 'Change Avatar',
      avatarDescription: 'Upload a new profile picture',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      location: 'Location',
      bio: 'Bio',
      saveChanges: 'Save Changes',
      uploadButton: 'Upload Photo',
      bioPlaceholder: 'Tell us a little about yourself...',
      bioDescription: 'Brief description for your profile',
      saving: 'Saving...',
      saved: 'Profile saved',
      saveSuccess: 'Your profile has been updated successfully',
      saveError: 'Save failed',
      saveErrorDescription: 'There was an error saving your profile. Please try again.',
      invalidFileType: 'Invalid file type',
      pleaseSelectImage: 'Please select an image file',
      fileTooLarge: 'File too large',
      maxFileSize: 'Maximum file size is 5MB',
      avatarUploaded: 'Avatar uploaded',
      avatarUploadSuccess: 'Your profile picture has been updated',
      uploadError: 'Upload failed',
      uploadErrorDescription: 'There was an error uploading your avatar. Please try again.'
    },
    settings: {
      title: 'Settings',
      accountSettings: 'Account Settings',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      notificationSettings: 'Notification Settings',
      emailNotifications: 'Email Notifications',
      emailNotificationsDescription: 'Receive notifications about updates and changes via email',
      pushNotifications: 'Push Notifications',
      pushNotificationsDescription: 'Receive notifications directly in your browser',
      saveChanges: 'Save Changes',
      saveSuccess: 'Settings saved successfully',
      saveError: 'Error saving settings',
      saveErrorDescription: 'There was an error saving your settings. Please try again.',
      passwordMismatch: 'New passwords do not match',
      invalidCurrentPassword: 'Current password is incorrect',
      passwordTooShort: 'Password must be at least 8 characters long',
      passwordRequirements: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    },
  },
  ja: {
    common: {
      close: '閉じる',
      save: '保存',
      addNew: '新規追加...',
      expand: '展開',
      collapse: '折りたたみ',
      language: '言語',
      vietnamese: 'ベトナム語',
      english: '英語',
      japanese: '日本語',
      back: '戻る',
      cancel: 'キャンセル',
      delete: '削除',
      edit: '編集',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      success: '成功',
      confirm: '確認',
      allRightsReserved: '全著作権所有',
      privacyPolicy: 'プライバシーポリシー',
      termsOfService: '利用規約',
    },
    workspace: {
      namePlaceholder: 'ワークスペース名を入力...',
      descriptionPlaceholder: 'ワークスペースの説明を入力...',
      tickets: 'チケット一覧',
      noTickets: 'チケットがありません。「チケット追加」をクリックして作成してください。'
    },
    ticket: {
      add: 'チケット追加',
      code: 'チケットコード',
      title: 'タイトル',
      link: 'リンク',
      milestone: 'マイルストーン',
      status: 'ステータス',
      estimateTime: '見積時間（時間）',
      actualTime: '実際時間（時間）',
      startTime: '開始時間',
      endTime: '終了時間',
      statuses: {
        todo: '未着手',
        inProgress: '進行中',
        done: '完了'
      },
      name: 'チケット名',
      description: '説明',
      assignee: '担当者',
      priority: '優先度',
      dueDate: '期限',
      save: '保存',
      details: 'チケット詳細'
    },
    milestone: {
      add: 'マイルストーン追加',
      title: 'タイトル',
      startTime: '開始時間',
      endTime: '終了時間',
      description: '説明',
      placeholder: {
        title: 'マイルストーンのタイトルを入力...',
        description: 'マイルストーンの説明を入力...'
      },
      name: 'マイルストーン名',
      dueDate: '期限',
      save: '保存',
      cancel: 'キャンセル'
    },
    dependency: {
      add: '依存関係を追加',
      type: '依存関係の種類',
      description: '説明',
      confirm: '依存関係を確認',
      types: {
        hard: 'Hard',
        soft: 'Soft'
      },
      note: 'メモ (オプション)',
      save: '保存',
      cancel: 'キャンセル'
    },
    footer: {
      appName: 'チケットマネージャー',
      allRightsReserved: '全著作権所有',
      privacyPolicy: 'プライバシーポリシー',
      termsOfService: '利用規約'
    },
    landing: {
      title: 'スマートチケット管理',
      description: '直感的で使いやすいインターフェースを備えた効率的なチケット管理ソリューション。強力な機能でワークフローを最適化。',
      getStarted: '始める',
      benefits: {
        time: {
          title: '時間の節約',
          description: '繰り返しタスクの自動化とチケットの効率的な管理'
        },
        accuracy: {
          title: '高精度',
          description: 'チケットの進捗とステータスを正確に追跡'
        },
        collaboration: {
          title: '簡単なコラボレーション',
          description: '共有と通知機能でチームとして効果的に作業'
        }
      }
    },
    login: {
      title: 'ログイン',
      email: 'メールアドレス',
      password: 'パスワード',
      rememberMe: 'ログイン情報を保存',
      forgotPassword: 'パスワードをお忘れですか？',
      signIn: 'ログイン',
      noAccount: 'アカウントをお持ちでない方',
      register: '新規登録'
    },
    home: {
      title: 'ワークスペース',
      subtitle: '作業の管理と整理',
      createWorkspace: '新規ワークスペース作成',
      members: 'メンバー',
      openWorkspace: 'ワークスペースを開く',
      createWorkspaceTitle: '新規ワークスペース作成',
      workspaceName: 'ワークスペース名',
      workspaceDescription: '説明',
      create: '作成',
      noWorkspaces: 'ワークスペースがありません。新規ワークスペースを作成して開始してください。',
      noWorkspacesTitle: 'ワークスペースがありません'
    },
    register: {
      title: 'アカウント作成',
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード確認',
      createAccount: 'アカウント作成',
      haveAccount: 'すでにアカウントをお持ちの方',
      signIn: 'ログイン'
    },
    nav: {
      dashboard: 'ダッシュボード',
      projects: 'プロジェクト',
      tasks: 'タスク',
      reports: 'レポート',
      guide: 'ガイド',
      profile: 'プロフィール',
      settings: '設定',
      logout: 'ログアウト'
    },
    guide: {
      title: 'ユーザーガイド',
      subtitle: 'Ticket Managerの効果的な使用方法を学ぶ',
      gettingStarted: 'はじめに',
      features: '機能',
      tutorials: 'チュートリアル',
      faq: 'よくある質問',
      contact: 'サポートに連絡'
    },
    profile: {
      title: '個人プロフィール',
      changeAvatar: 'アバターを変更',
      avatarDescription: '新しいプロフィール画像をアップロード',
      personalInfo: '個人情報',
      fullName: '氏名',
      email: 'メールアドレス',
      phone: '電話番号',
      location: '所在地',
      bio: '自己紹介',
      saveChanges: '変更を保存',
      uploadButton: '写真をアップロード',
      bioPlaceholder: '自己紹介を入力してください...',
      bioDescription: 'プロフィールの簡単な説明',
      saving: '保存中...',
      saved: 'プロフィールを保存しました',
      saveSuccess: 'プロフィールが正常に更新されました',
      saveError: '保存に失敗しました',
      saveErrorDescription: 'プロフィールの保存中にエラーが発生しました。もう一度お試しください。',
      invalidFileType: '無効なファイル形式です',
      pleaseSelectImage: '画像ファイルを選択してください',
      fileTooLarge: 'ファイルが大きすぎます',
      maxFileSize: '最大ファイルサイズは5MBです',
      avatarUploaded: 'アバターをアップロードしました',
      avatarUploadSuccess: 'プロフィール画像が更新されました',
      uploadError: 'アップロードに失敗しました',
      uploadErrorDescription: 'アバターのアップロード中にエラーが発生しました。もう一度お試しください。'
    },
    settings: {
      title: '設定',
      accountSettings: 'アカウント設定',
      currentPassword: '現在のパスワード',
      newPassword: '新しいパスワード',
      confirmPassword: '新しいパスワードの確認',
      notificationSettings: '通知設定',
      emailNotifications: 'メール通知',
      emailNotificationsDescription: '更新や変更に関する通知をメールで受け取る',
      pushNotifications: 'プッシュ通知',
      pushNotificationsDescription: 'ブラウザで直接通知を受け取る',
      saveChanges: '変更を保存',
      saveSuccess: '設定を保存しました',
      saveError: '設定の保存に失敗しました',
      saveErrorDescription: '設定の保存中にエラーが発生しました。もう一度お試しください。',
      passwordMismatch: '新しいパスワードが一致しません',
      invalidCurrentPassword: '現在のパスワードが正しくありません',
      passwordTooShort: 'パスワードは8文字以上である必要があります',
      passwordRequirements: 'パスワードには大文字、小文字、数字を少なくとも1文字ずつ含める必要があります'
    },
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'vi',
  messages
});

export default i18n;
